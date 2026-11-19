(function () {
  const API = "https://fragrant-bird-c4c0.dicestack88.workers.dev/";

  async function updateVisitorCounters() {
    const visitResponse = await fetch(API, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      cache: "no-store"
    });
    if (!visitResponse.ok) {
      throw new Error("The visitor counter rejected this page view (" + visitResponse.status + ").");
    }

    const statsResponse = await fetch(API, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store"
    });
    if (!statsResponse.ok) {
      throw new Error("Could not retrieve visitor totals (" + statsResponse.status + ").");
    }

    const stats = await statsResponse.json();
    const format = new Intl.NumberFormat("en-AU");
    const today = document.getElementById("visitors-today");
    const lifetime = document.getElementById("visitors-total");

    if (today && Number.isFinite(Number(stats.today))) {
      today.textContent = format.format(Number(stats.today));
    }
    if (lifetime && Number.isFinite(Number(stats.lifetime))) {
      lifetime.textContent = format.format(Number(stats.lifetime));
    }
  }

  updateVisitorCounters().catch(error => {
    console.error("[visitor-stats] Cloudflare counter failed:", error);
  });
})();
