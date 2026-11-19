(function () {
  const counterScript = document.createElement("script");
  counterScript.dataset.goatcounter = "https://dicestack88.goatcounter.com/count";
  counterScript.async = true;
  counterScript.src = "https://gc.zgo.at/count.js";

  const dateParts = new Intl.DateTimeFormat("en", {
    timeZone: "Australia/Canberra",
    year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(dateParts.map(part => [part.type, part.value]));
  const today = values.year + "-" + values.month + "-" + values.day;

  counterScript.addEventListener("load", function () {
    if (!window.goatcounter || !window.goatcounter.visit_count) return;
    const style = [
      "div { width:auto; height:auto; padding:0; margin:0; border:0; background:transparent; color:#edf3fa; font-family:Inter,system-ui,sans-serif; }",
      "#gcvc-views { color:#edf3fa; font-size:clamp(2.8rem,7vw,5.4rem); line-height:1; font-weight:780; letter-spacing:-.075em; }",
      "#gcvc-for, #gcvc-by { display:none !important; }"
    ].join("\n");

    window.goatcounter.visit_count({
      append: "#visitors-today", path: "TOTAL",
      start: today, end: today, no_branding: true, style: style
    });
    window.goatcounter.visit_count({
      append: "#visitors-total", path: "TOTAL",
      start: "2026-11-19", no_branding: true, style: style
    });
  });

  document.head.appendChild(counterScript);
})();