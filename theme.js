const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

function enableDarkMode() {
  body.classList.remove('light-mode');
  if (themeToggle) {
    themeToggle.textContent = '🌙';
    themeToggle.title = 'Switch to light mode';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  }
  localStorage.setItem('theme', 'dark');
}

function enableLightMode() {
  body.classList.add('light-mode');
  if (themeToggle) {
    themeToggle.textContent = '☀️';
    themeToggle.title = 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  localStorage.setItem('theme', 'light');
}

function closeNavigation() {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  siteNav.classList.remove('is-open');
}

document.addEventListener('DOMContentLoaded', () => {
  (localStorage.getItem('theme') || 'dark') === 'light' ? enableLightMode() : enableDarkMode();

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
  });
});

themeToggle?.addEventListener('click', () => {
  body.classList.contains('light-mode') ? enableDarkMode() : enableLightMode();
});

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  siteNav?.classList.toggle('is-open', !open);
});

document.querySelectorAll('.navbar nav a').forEach((link) => link.addEventListener('click', closeNavigation));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
