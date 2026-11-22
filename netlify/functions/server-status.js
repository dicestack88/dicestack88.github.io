const ALLOWED_ORIGINS = new Set([
  "https://dicestack88.github.io"
]);

const EAGLER_HOSTS = new Set([
  "arch.mc", "mc.voidsent.net", "esl.bagelsmp.com", "tuff.ws",
  "pcsmp.net", "eagler.carrot-craft.org", "zentic.cc",
  "play.heartsmp.net", "mercurymc.net", "eaglercraft.co.uk",
  "mc.zyth.me", "eagler.totalfreedom.tf", "krypticmc.net",
  "aeon-network.net", "play.mytheriamc.net", "ggsmp.net",
  "wanderwoodsmp.com", "play.shadownetwork.shop", "ethereal.mov",
  "ragepvp.us"
]);

const JAVA_HOSTS = new Set([
  "mc.hypixel.net", "play.wynncraft.com", "play.cubecraft.net",
  "play.mccisland.net", "play.pvplegacy.net", "play.jartexnetwork.com"
]);

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://dicestack88.github.io",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin"
});

function numberAt(obj, paths) {
  for (const path of paths) {
    let value = obj;
    for (const key of path) value = value && value[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function normalizeEagler(data) {
  const payload = data && data.data && typeof data.data === "object" ? data.data : data;
  let players = numberAt(payload, [["players", "online"], ["players", "current"], ["playerCount"], ["onlinePlayers"], ["playersOnline"]]);
  let max = numberAt(payload, [["players", "max"], ["maxPlayers"], ["max"]]);
  if (players === null) players = numberAt(data, [["players", "online"], ["playerCount"], ["onlinePlayers"]]);
  if (max === null) max = numberAt(data, [["players", "max"], ["maxPlayers"]]);
  if (players === null && typeof payload.online === "number") players = payload.online;
  const online = payload.online === true || payload.status === "online" || payload.isOnline === true ||
    data.online === true || data.status === "online";
  return {
    online,
    players,
    max,
    version: String(payload.version || data.version || ""),
    source: "TopEaglerServers"
  };
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error(`Upstream returned HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function checkServer(edition, host) {
  const url = edition === "eagler"
    ? `https://topeaglerservers.com/api/status/${encodeURIComponent(host)}`
    : `https://api.mcsrvstat.us/3/${encodeURIComponent(host)}`;
  try {
    const data = await fetchJson(url);
    if (edition === "eagler") return normalizeEagler(data);
    return {
      online: data.online === true,
      players: numberAt(data, [["players", "online"]]),
      max: numberAt(data, [["players", "max"]]),
      version: String(data.version || ""),
      source: "MCSrvStat"
    };
  } catch (error) {
    return {
      online: false,
      players: null,
      max: null,
      version: "",
      source: edition === "eagler" ? "TopEaglerServers" : "MCSrvStat",
      error: error.name === "AbortError" ? "Upstream timed out" : "Upstream status unavailable"
    };
  }
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";
  const headers = {
    ...corsHeaders(origin),
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  if (origin && !ALLOWED_ORIGINS.has(origin)) return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };

  const requested = new URLSearchParams(event.rawQuery || "").get("servers") || "";
  const entries = requested.split(",").filter(Boolean);
  if (!entries.length || entries.length > 30) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Request 1–30 known servers" }) };
  }

  const parsed = [];
  for (const entry of entries) {
    const separator = entry.indexOf(":");
    const edition = entry.slice(0, separator);
    const host = entry.slice(separator + 1).toLowerCase();
    const allowed = edition === "eagler" ? EAGLER_HOSTS : edition === "java" ? JAVA_HOSTS : null;
    if (!allowed || !allowed.has(host)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown server in request" }) };
    }
    parsed.push({ edition, host });
  }

  const results = {};
  let cursor = 0;
  async function worker() {
    while (cursor < parsed.length) {
      const item = parsed[cursor++];
      results[item.host] = {
        ...(await checkServer(item.edition, item.host)),
        checkedAt: new Date().toISOString()
      };
    }
  }
  await Promise.all(Array.from({ length: Math.min(5, parsed.length) }, worker));
  return { statusCode: 200, headers, body: JSON.stringify({ results, generatedAt: new Date().toISOString() }) };
};
