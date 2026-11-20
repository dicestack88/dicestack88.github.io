/* Dicestack88 ecosystem appearance: dark-only, Frosted Glass by default. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.remove('light-mode');
  root.style.colorScheme = 'dark';
  document.body?.classList.remove('light-mode');
  try {
    localStorage.setItem('theme', 'dark');
    if (!['liquid', 'frosted'].includes(localStorage.getItem('dicestack-glass-mode'))) {
      localStorage.setItem('dicestack-glass-mode', 'frosted');
    }
  } catch (_) {}
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
