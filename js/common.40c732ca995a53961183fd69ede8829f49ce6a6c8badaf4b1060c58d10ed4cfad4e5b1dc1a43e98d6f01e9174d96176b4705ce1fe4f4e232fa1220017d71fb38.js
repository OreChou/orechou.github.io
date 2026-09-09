/**
 * Theme-wide utilities exposed on window.cactus. Loaded FIRST by baseof
 * (before spa-router, code-copy, main, reading-progress) so the IIFE
 * bootstraps in every consumer. Section scripts that lazy-load (paintings,
 * neodb) run after baseof is parsed, so cactus is always available to them.
 *
 * Helpers cover things that would otherwise be copy-pasted across files:
 *  - onReady / onSpaReinit: the readyState + spa-content-loaded pair that
 *    every section file needs
 *  - escapeHtml / t: the dataset-prefixed i18n pattern set up by head.html
 *  - lockScroll: body-overflow lock for modals; the painting modal, search
 *    palette, and main.js lightbox all toggle the same property
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function onSpaReinit(fn) {
    window.addEventListener('spa-content-loaded', fn);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // t(prefix, key, fallback): reads document.documentElement.dataset.<prefix><Key>
  // where Key is key with the first letter upper-cased. Set by head.html from
  // the i18n bundles. Falls back to `fallback` when the dataset attribute is
  // missing or empty.
  function t(prefix, key, fallback) {
    var prop = prefix + key.charAt(0).toUpperCase() + key.slice(1);
    var v = document.documentElement.dataset[prop];
    return v ? v : fallback;
  }

  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  window.cactus = {
    onReady: onReady,
    onSpaReinit: onSpaReinit,
    escapeHtml: escapeHtml,
    t: t,
    lockScroll: lockScroll
  };
})();
