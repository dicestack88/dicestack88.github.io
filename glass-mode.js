/* Dicestack ecosystem glass appearance selector. Dark mode is always enforced. */
(() => {
  "use strict";
  if (window.__dicestackGlassModeLoaded) return;
  window.__dicestackGlassModeLoaded = true;
  const KEY = "dicestack-glass-mode";
  const root = document.documentElement;
  const valid = value => value === "liquid" || value === "frosted";
  const readMode = () => {
    try {
      const stored = localStorage.getItem(KEY);
      if (valid(stored)) return stored;
      localStorage.setItem(KEY, "frosted");
    } catch (_) {}
    return "frosted";
  };
  let mode = readMode(), picker, summary;
  function apply(nextMode, persist = false) {
    mode = valid(nextMode) ? nextMode : "frosted";
    root.dataset.glassMode = mode;
    root.style.colorScheme = "dark";
    root.classList.toggle("glass-liquid", mode === "liquid");
    root.classList.toggle("glass-frosted", mode === "frosted");
    if (persist) { try { localStorage.setItem(KEY, mode); } catch (_) {} }
    if (summary) summary.textContent = mode === "liquid" ? "◈ Liquid Glass" : "◈ Frosted Glass";
    if (picker) picker.querySelectorAll("[data-glass-choice]").forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.glassChoice === mode)));
    window.dispatchEvent(new CustomEvent("glass-mode-change", { detail: mode }));
  }
  function mountPicker() {
    if (document.querySelector(".dicestack-glass-picker")) return;
    picker = document.createElement("details");
    picker.className = "dicestack-glass-picker";
    const trigger = document.createElement("summary");
    summary = document.createElement("span");
    trigger.append(summary);
    const panel = document.createElement("div");
    panel.className = "dicestack-glass-panel";
    const heading = document.createElement("strong");
    heading.textContent = "Appearance";
    const description = document.createElement("p");
    description.textContent = "Choose how glass surfaces are rendered.";
    panel.append(heading, description);
    for (const [value, title, detail] of [
      ["frosted", "Frosted Glass", "Lightweight blur for smoother performance"],
      ["liquid", "Liquid Glass", "Enhanced highlights and refraction effects"]
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.glassChoice = value;
      const name = document.createElement("strong");
      name.textContent = title;
      const note = document.createElement("small");
      note.textContent = detail;
      button.append(name, note);
      button.addEventListener("click", () => { apply(value, true); picker.open = false; });
      panel.append(button);
    }
    picker.append(trigger, panel);
    document.body.append(picker);
    apply(mode);
  }
  apply(mode);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountPicker, { once: true });
  else mountPicker();
  window.addEventListener("storage", event => { if (event.key === KEY) apply(event.newValue); });
})();
