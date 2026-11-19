// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme') || 'dark';
// Check for saved glass preference or default to 'liquid'
const savedGlass = localStorage.getItem('glass') || 'liquid';

// Apply saved theme and glass mode on page load
document.addEventListener('DOMContentLoaded', () => {
  if (savedTheme === 'light') {
    enableLightMode();
  } else {
    enableDarkMode();
  }

  // Insert the glass toggle button next to the theme toggle if possible
  setupGlassToggle(savedGlass);

  // Mark the selected material mode for shared CSS, including browsers without SVG refraction support.
  document.documentElement.classList.toggle('lg-frosted-mode', savedGlass === 'frosted');

  // Broadcast initial glass mode so liquid-glass.js can respond
  window.dispatchEvent(new CustomEvent('glass-mode-change', { detail: savedGlass }));
});

// Theme toggle button click handler
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
      enableDarkMode();
    } else {
      enableLightMode();
    }
  });
}

function enableDarkMode() {
  body.classList.remove('light-mode');
  document.documentElement.classList.remove('light-mode');
  if (themeToggle) {
    themeToggle.textContent = '🌙';
    themeToggle.title = 'Switch to light mode';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  }
  localStorage.setItem('theme', 'dark');
}

function enableLightMode() {
  body.classList.add('light-mode');
  document.documentElement.classList.add('light-mode');
  if (themeToggle) {
    themeToggle.textContent = '☀️';
    themeToggle.title = 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  localStorage.setItem('theme', 'light');
}

// Glass toggle setup and handlers
function setupGlassToggle(initialMode) {
  // If there's already a button in the DOM, reuse it
  let glassToggle = document.getElementById('glassToggle');

  // Find a sane insert point: right after themeToggle if present, otherwise put it in the header
  const header = document.querySelector('.navbar');

  if (!glassToggle) {
    glassToggle = document.createElement('button');
    glassToggle.id = 'glassToggle';
    glassToggle.className = 'theme-toggle';
    glassToggle.style.marginLeft = '8px';
    glassToggle.type = 'button';

    // Insert after themeToggle if possible
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.insertBefore(glassToggle, themeToggle.nextSibling);
    } else if (header) {
      header.appendChild(glassToggle);
    } else {
      // fallback: append to body
      document.body.appendChild(glassToggle);
    }
  }

  function updateGlassButton(mode) {
    if (!glassToggle) return;
    if (mode === 'liquid') {
      glassToggle.textContent = '🫧';
      glassToggle.title = 'Liquid glass (refraction) — click to switch to frosted';
      glassToggle.setAttribute('aria-label', 'Liquid glass (refraction) — click to switch to frosted');
    } else {
      glassToggle.textContent = '❄️';
      glassToggle.title = 'Frosted glass (backdrop blur) — click to switch to liquid';
      glassToggle.setAttribute('aria-label', 'Frosted glass (backdrop blur) — click to switch to liquid');
    }
  }

  // Initialize UI
  updateGlassButton(initialMode);

  // Click handler toggles between 'liquid' and 'frosted'
  glassToggle.addEventListener('click', () => {
    const current = localStorage.getItem('glass') || initialMode;
    const next = current === 'liquid' ? 'frosted' : 'liquid';
    localStorage.setItem('glass', next);
    document.documentElement.classList.toggle('lg-frosted-mode', next === 'frosted');
    updateGlassButton(next);

    // notify other scripts (and other tabs via storage event)
    window.dispatchEvent(new CustomEvent('glass-mode-change', { detail: next }));
  });

  // Sync button if other tabs change the preference
  window.addEventListener('storage', (e) => {
    if (e.key === 'glass') {
      const mode = e.newValue || initialMode;
      document.documentElement.classList.toggle('lg-frosted-mode', mode === 'frosted');
      updateGlassButton(mode);
    }
  });
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
