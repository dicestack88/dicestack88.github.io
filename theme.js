/* Dicestack88 ecosystem appearance: fixed dark Liquid Glass. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.remove('light-mode', 'lg-frosted-mode');
  root.style.colorScheme = 'dark';
  document.body?.classList.remove('light-mode');
  try {
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('glass', 'liquid');
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('glass-mode-change', { detail: 'liquid' }));
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
