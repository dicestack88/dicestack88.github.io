/* Dicestack88 Liquid Glass — controlled single-pass SVG refraction.
   Real refraction is limited to surfaces selected by surfaceSelectors.
   This script now respects the user's `glass` preference ("liquid" vs "frosted")
   stored in localStorage and listens for the `glass-mode-change` CustomEvent and
   storage events so the UI toggle works immediately across tabs.
*/
(() => {
  'use strict';

  const surfaceSelectors = [
    '.navbar', 'body > nav', '.glass-card', '.card', '.card1', '.card2', '.card3', '.card4',
    '.experience-panel', '.feature-card', '.theme-toggle', '.btn', '.panel',
    '.youtube-embed-panel', '.video-error', '.video-card', '.filter-btn', '.yt-card',
    '.split-card', '.player-box', '.cta-inner', '.stat', '.hero-badge', '.tag', '.status',
    '.social-card', '.resource-card', '.client-card', '.wide-card', '.about-section',
    '.channel-link', '.footer', 'footer', '.hero-stats > div'
  ].join(',');

  function addFilter() {
    if (document.getElementById('liquidGlassRefraction')) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';

    const defs = document.createElementNS(svgNS, 'defs');
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', 'liquidGlassRefraction');
    filter.setAttribute('x', '-12%');
    filter.setAttribute('y', '-12%');
    filter.setAttribute('width', '124%');
    filter.setAttribute('height', '124%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    const noise = document.createElementNS(svgNS, 'feTurbulence');
    noise.setAttribute('type', 'fractalNoise');
    noise.setAttribute('baseFrequency', '0.018 0.028');
    noise.setAttribute('numOctaves', '3');
    noise.setAttribute('seed', '7');
    noise.setAttribute('result', 'lensMap');

    const blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('in', 'lensMap');
    blur.setAttribute('stdDeviation', '1.5');
    blur.setAttribute('result', 'lensBlur');

    const displacement = document.createElementNS(svgNS, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'lensBlur');
    displacement.setAttribute('scale', '22');
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');

    filter.append(noise, blur, displacement);
    defs.append(filter);
    svg.append(defs);
    (document.body || document.documentElement).prepend(svg);
  }

  function init() {
    const root = document.documentElement;
    if (!document.querySelector('script[data-glass-mode-loader]')) {
      const pickerScript = document.createElement('script');
      pickerScript.src = 'glass-mode.js';
      pickerScript.dataset.glassModeLoader = 'true';
      document.head.append(pickerScript);
    }
    const surfaces = Array.from(document.querySelectorAll(surfaceSelectors));
    surfaces.forEach(el => el.classList.add('lg-surface'));

    const isChromium = /Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/OPR\//.test(navigator.userAgent);
    const supportsBlur = window.CSS && CSS.supports && CSS.supports('backdrop-filter', 'blur(1px)');

    if (!isChromium || !supportsBlur) {
      root.classList.remove('lg-refraction-supported', 'lg-svg-filter-supported');
      return;
    }

    addFilter();

    function applyMode(mode) {
      if (mode === 'liquid') {
        surfaces.forEach(el => el.classList.add('lg-lens-active'));
        root.classList.add('lg-refraction-supported', 'lg-svg-filter-supported');
      } else {
        surfaces.forEach(el => el.classList.remove('lg-lens-active'));
        root.classList.remove('lg-refraction-supported', 'lg-svg-filter-supported');
      }
    }

    const initialMode = localStorage.getItem('dicestack-glass-mode') || 'frosted';
    applyMode(initialMode);

    window.addEventListener('glass-mode-change', (e) => {
      const mode = (e && e.detail) ? e.detail : (localStorage.getItem('glass') || 'liquid');
      applyMode(mode);
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'dicestack-glass-mode') {
        applyMode(e.newValue || 'frosted');
      }
    });

    root.liquidGlass = root.liquidGlass || {};
    root.liquidGlass.applyMode = applyMode;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
