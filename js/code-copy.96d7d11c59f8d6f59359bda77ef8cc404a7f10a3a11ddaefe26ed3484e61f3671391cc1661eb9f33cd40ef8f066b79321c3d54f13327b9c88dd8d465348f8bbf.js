(() => {
  'use strict';

  /**
   * Copy text to clipboard with fallback for older browsers
   * @param {string} text - Text to copy
   * @returns {Promise<void>}
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback for older browsers
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }

  /**
   * Create a copy button for code block
   * @param {HTMLElement} codeNode - The code element
   * @param {string} copyLabel - Label for copy button
   * @param {string} copiedLabel - Label after copying
   * @returns {HTMLButtonElement}
   */
  function createCopyButton(codeNode, copyLabel, copiedLabel) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.type = 'button';
    copyBtn.textContent = copyLabel;
    copyBtn.setAttribute('aria-label', copyLabel);
    copyBtn.setAttribute('title', copyLabel);

    let resetTimer;

    copyBtn.addEventListener('click', () => {
      // Use textContent instead of innerText for better performance and security
      const codeText = codeNode.textContent || '';

      copyToClipboard(codeText)
        .then(() => {
          copyBtn.textContent = copiedLabel;
          copyBtn.setAttribute('aria-label', copiedLabel);
          copyBtn.classList.add('copied');

          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            copyBtn.textContent = copyLabel;
            copyBtn.setAttribute('aria-label', copyLabel);
            copyBtn.classList.remove('copied');
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy code:', err);
          copyBtn.textContent = errorLabel;
          setTimeout(() => {
            copyBtn.textContent = copyLabel;
          }, 1500);
        });
    });

    return copyBtn;
  }

  /**
   * Initialize copy buttons for all code blocks
   */
  function initCopyButtons() {
    // i18n labels come from data-* attributes set by head.html
    const copyLabel = window.cactus.t('code', 'copy', 'Copy');
    const copiedLabel = window.cactus.t('code', 'copied', 'Copied!');
    const errorLabel = window.cactus.t('code', 'copyError', 'Error');

    // Find all code blocks (excluding line number columns)
    const codeBlocks = document.querySelectorAll('.highlight pre > code, pre > code');

    codeBlocks.forEach((codeNode) => {
      // Skip if button already exists
      if (codeNode.parentNode.querySelector('.code-copy-btn')) {
        return;
      }

      // Skip if inside line number column (first td)
      const parentTd = codeNode.closest('td');
      if (parentTd) {
        const parentRow = parentTd.parentElement;
        if (parentRow && parentRow.firstElementChild === parentTd) {
          return; // Skip first column (line numbers)
        }
      }

      const copyBtn = createCopyButton(codeNode, copyLabel, copiedLabel);
      const preNode = codeNode.parentNode;
      preNode.style.position = 'relative';
      preNode.insertBefore(copyBtn, codeNode);
    });
  }

  // Initialize on DOM ready and re-initialize after SPA navigation.
  window.cactus.onReady(initCopyButtons);
  window.cactus.onSpaReinit(initCopyButtons);

})();
