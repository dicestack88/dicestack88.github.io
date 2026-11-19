(function () {
  const dateParts = new Intl.DateTimeFormat("en", {
    timeZone: "Australia/Canberra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    dateParts.map((part) => [part.type, part.value])
  );
  const today = values.year + "-" + values.month + "-" + values.day;

  const style = `
    div {
      width: auto;
      height: auto;
      padding: 0;
      margin: 0;
      border: 0;
      background: transparent;
      color: #edf3fa;
      font-family: Inter, system-ui, sans-serif;
    }
    #gcvc-views {
      color: #edf3fa;
      font-size: clamp(2.8rem, 7vw, 5.4rem);
      line-height: 1;
      font-weight: 780;
      letter-spacing: -.075em;
    }
    #gcvc-for, #gcvc-by {
      display: none !important;
    }
  `;

  // GoatCounter documents this polling pattern because count.js loads async.
  // Keep checking until its public visit_count API is ready.
  const timer = window.setInterval(function () {
    if (
      !window.goatcounter ||
      typeof window.goatcounter.visit_count !== "function"
    ) {
      return;
    }

    window.clearInterval(timer);

    try {
      window.goatcounter.visit_count({
        append: "#visitors-today",
        path: "TOTAL",
        start: today,
        end: today,
        no_branding: true,
        style: style
      });

      window.goatcounter.visit_count({
        append: "#visitors-total",
        path: "TOTAL",
        start: "2026-11-19",
        no_branding: true,
        style: style
      });
    } catch (error) {
      console.error("[visitor-stats] GoatCounter could not render the counters:", error);
    }
  }, 100);

  // Equivalent to the documented async count.js script tag.
  const counterScript = document.createElement("script");
  counterScript.dataset.goatcounter = "https://dicestack88.goatcounter.com/count";
  counterScript.async = true;
  counterScript.src = "https://gc.zgo.at/count.js";
  counterScript.onerror = function () {
    window.clearInterval(timer);
    console.error("[visitor-stats] Failed to load GoatCounter count.js.");
  };
  document.head.appendChild(counterScript);
})();