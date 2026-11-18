(function () {
  const site = "https://dicestack88.goatcounter.com";
  const counterScript = document.createElement("script");
  counterScript.dataset.goatcounter = site + "/count";
  counterScript.async = true;
  counterScript.src = "https://gc.zgo.at/count.js";
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Australia/Canberra", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const today = dateParts.year + "-" + dateParts.month + "-" + dateParts.day;
  counterScript.addEventListener("load", function () {
    const renderCounts = function () {
      if (!window.goatcounter || typeof window.goatcounter.visit_count !== "function") {
        window.setTimeout(renderCounts, 100);
        return;
      }
      const sharedStyle = [
        "div { width: auto; height: auto; padding: 0; margin: 0; border: 0; background: transparent; color: #edf3fa; font-family: Inter, system-ui, sans-serif; }",
        "#gcvc-views { color: #edf3fa; font-size: clamp(2.8rem, 7vw, 5.4rem); line-height: 1; font-weight: 780; letter-spacing: -0.075em; }",
        "#gcvc-for, #gcvc-by { display: none !important; }"
      ].join("\n");
      window.goatcounter.visit_count({
        append: "#visitors-today", path: "TOTAL", start: today, end: today,
        no_branding: true, style: sharedStyle
      });
      window.goatcounter.visit_count({
        append: "#visitors-total", path: "TOTAL", start: "2026-11-19",
        no_branding: true, style: sharedStyle
      });
    };
    renderCounts();
  });
  document.head.appendChild(counterScript);
})();