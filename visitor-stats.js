(function () {
  const counterScript = document.createElement("script");
  counterScript.dataset.goatcounter = "https://dicestack88.goatcounter.com/count";
  counterScript.async = true;
  counterScript.src = "https://gc.zgo.at/count.js";

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

  const style = [
    "div { width:auto; height:auto; padding:0; margin:0; border:0; background:transparent; color:#edf3fa; font-family:Inter,system-ui,sans-serif; }",
    "#gcvc-views { color:#edf3fa; font-size:clamp(2.8rem,7vw,5.4rem); line-height:1; font-weight:780; letter-spacing:-.075em; }",
    "#gcvc-for, #gcvc-by { display:none !important; }"
  ].join("\n");

  let attempts = 0;
  const maxAttempts = 100;

  function showUnavailable(message) {
    ["visitors-today", "visitors-total"].forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.textContent.trim() === "—") {
        element.textContent = "Unavailable";
      }
    });
    console.error("[visitor-stats] " + message);
  }

  function renderCounters() {
    if (
      window.goatcounter &&
      typeof window.goatcounter.visit_count === "function"
    ) {
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
        showUnavailable("Could not render the public visitor counters.");
        console.error(error);
      }
      return;
    }

    attempts += 1;
    if (attempts >= maxAttempts) {
      showUnavailable(
        "GoatCounter's count.js did not become available. Check network blocking and the script request."
      );
      return;
    }

    window.setTimeout(renderCounters, 100);
  }

  counterScript.addEventListener("error", function () {
    showUnavailable(
      "Failed to load https://gc.zgo.at/count.js. Check network or content blockers."
    );
  });

  document.head.appendChild(counterScript);
  renderCounters();
})();