(() => {
  // Block banner initialization and web components
  const blockBanners = () => {
    // Remove existing banners
    const selectors = [
      'aside:has(> gu-island[name="StickyBottomBanner"])',
      'aside:has(> gu-island[name="UsEoy2024Wrapper"])',
      'gu-island[name="StickyBottomBanner"]',
      'gu-island[name="UsEoy2024Wrapper"]',
      'aside:has(fieldset)',
      'aside:has(input[name*="contribution"])',
      'aside:has(> div:has(fieldset))',
      'aside:has(picture)',
      'div:has(> [data-contribution-type])',
      'div:has(> [name*="contribution"])',
      'div:has(fieldset)',
      'fieldset',
      '[name*="contribution"]',
      '[data-contribution-type]',
      'picture + div',
      'aside:last-child',
      // Add specific selectors for StickyBottomBanner
      'aside > gu-island[name="StickyBottomBanner"]',
      'aside:has(gu-island[name="StickyBottomBanner"])',
      'aside:has(> div > gu-island[name="StickyBottomBanner"])',
      // Target contribution form elements
      'input[name*="contributions-banner-choice-cards"]',
      'fieldset:has(input[name*="contributions-banner-choice-cards"])',
      'aside:has(fieldset:has(input[name*="contributions-banner-choice-cards"]))'
    ];

    // Remove elements matching selectors
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });
  };

  // Execute banner blocking immediately and on DOM changes
  blockBanners();
  document.addEventListener('DOMContentLoaded', blockBanners);
  window.addEventListener('load', blockBanners);

  // Block web components
  const blockCustomElements = () => {
    if (!window.customElements) return;
    const noop = () => {};
    Object.defineProperty(window, 'customElements', {
      value: {
        define: noop,
        get: () => undefined,
        whenDefined: () => Promise.resolve(),
        upgrade: noop
      },
      configurable: false,
      enumerable: false,
      writable: false
    });
  };

  // Execute web component blocking
  blockCustomElements();
  document.addEventListener('DOMContentLoaded', blockCustomElements);

  // Prevent Shadow DOM attachment
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function() {
    if (this.tagName && this.tagName.toLowerCase() === 'gu-island') {
      return this;
    }
    return originalAttachShadow.apply(this, arguments);
  };

  // Block element creation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    if (tagName.toLowerCase() === 'gu-island') {
      const div = originalCreateElement.call(document, 'div');
      div.style.cssText = 'display:none!important;';
      return div;
    }
    return originalCreateElement.call(document, tagName, options);
  };

  // Remove elements as they appear
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check for banner elements
          if (node.tagName && (
            node.tagName.toLowerCase() === 'aside' ||
            node.tagName.toLowerCase() === 'gu-island' ||
            node.querySelector('fieldset') ||
            node.querySelector('[name*="contribution"]')
          )) {
            node.remove();
          }
          // Remove any scripts that might initialize the banner
          if (node.tagName === 'SCRIPT') {
            const src = node.src || '';
            if (src.includes('guardian') || src.includes('contributions')) {
              node.remove();
            }
          }
        }
      });
    });

    // Run banner blocking after mutations
    blockBanners();
  });

  // Start observing with aggressive configuration
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  // Override CSS variables
  const overrideCSSVariables = () => {
    const variables = [
      '--sticky-banner-height',
      '--banner-height',
      '--contributions-banner-height',
      '--banner-bottom-height',
      '--banner-top-height'
    ];
    variables.forEach(variable => {
      document.documentElement.style.setProperty(variable, '0', 'important');
    });
  };

  // Execute CSS variable override
  overrideCSSVariables();
  document.addEventListener('DOMContentLoaded', overrideCSSVariables);
  window.addEventListener('load', overrideCSSVariables);
})();
