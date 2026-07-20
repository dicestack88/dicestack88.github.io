// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const body = document.body;

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme') || 'dark';

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  if (savedTheme === 'light') {
    enableLightMode();
  } else {
    enableDarkMode();
  }
});

// Theme toggle button click handler
themeToggle.addEventListener('click', () => {
  if (body.classList.contains('light-mode')) {
    enableDarkMode();
  } else {
    enableLightMode();
  }
});

function enableDarkMode() {
  body.classList.remove('light-mode');
  themeToggle.textContent = '🌙';
  themeToggle.title = 'Switch to light mode';
  localStorage.setItem('theme', 'dark');
}

function enableLightMode() {
  body.classList.add('light-mode');
  themeToggle.textContent = '☀️';
  themeToggle.title = 'Switch to dark mode';
  localStorage.setItem('theme', 'light');
}

// Add smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
