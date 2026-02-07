/**
 * Script to clean HTML by removing unnecessary nodes during scraping
 * Removes script tags, style tags, comments, and other non-content elements
 */

/**
 * Removes unwanted elements from a DOM element or document
 * @param {HTMLElement|Document} rootElement - The root element to clean
 * @param {Object} options - Configuration options
 * @returns {HTMLElement|Document} The cleaned element
 */
function cleanHTML(rootElement, options = {}) {
  const defaultOptions = {
    removeScripts: true,
    removeStyles: true,
    removeComments: true,
    removeNoscript: true,
    removeIframes: true,
    removeSVG: false,
    removeHidden: true,
    removeEmptyElements: false,
    preserveClasses: [],
    preserveIds: [],
    additionalSelectors: [] // Additional selectors to remove
  };

  const config = { ...defaultOptions, ...options };
  
  if (!rootElement) {
    throw new Error('Root element is required');
  }

  // Selectors for elements to remove
  const selectorsToRemove = [];

  if (config.removeScripts) {
    selectorsToRemove.push('script');
  }

  if (config.removeStyles) {
    selectorsToRemove.push('style', 'link[rel="stylesheet"]');
  }

  if (config.removeNoscript) {
    selectorsToRemove.push('noscript');
  }

  if (config.removeIframes) {
    selectorsToRemove.push('iframe');
  }

  if (config.removeSVG) {
    selectorsToRemove.push('svg');
  }

  if (config.removeHidden) {
    selectorsToRemove.push('[hidden]', '[style*="display: none"]', '[style*="display:none"]');
  }

  // Add custom selectors
  if (config.additionalSelectors.length > 0) {
    selectorsToRemove.push(...config.additionalSelectors);
  }

  // Remove elements by selector
  selectorsToRemove.forEach(selector => {
    const elements = rootElement.querySelectorAll(selector);
    elements.forEach(el => {
      // Check if element should be preserved
      const shouldPreserve = 
        config.preserveClasses.some(cls => el.classList && el.classList.contains(cls)) ||
        config.preserveIds.some(id => el.id === id);
      
      if (!shouldPreserve && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  });

  // Remove comments
  if (config.removeComments) {
    removeComments(rootElement);
  }

  // Remove empty elements (optional)
  if (config.removeEmptyElements) {
    removeEmptyElements(rootElement);
  }

  return rootElement;
}

/**
 * Removes all comment nodes from an element
 * @param {HTMLElement|Document} rootElement - The root element
 */
function removeComments(rootElement) {
  const iterator = document.createNodeIterator(
    rootElement,
    NodeFilter.SHOW_COMMENT,
    null
  );

  const comments = [];
  let currentNode;

  while (currentNode = iterator.nextNode()) {
    comments.push(currentNode);
  }

  comments.forEach(comment => {
    if (comment.parentNode) {
      comment.parentNode.removeChild(comment);
    }
  });
}

/**
 * Removes empty elements (elements with no text content and no children)
 * @param {HTMLElement|Document} rootElement - The root element
 */
function removeEmptyElements(rootElement) {
  const emptyElements = [];
  const allElements = rootElement.querySelectorAll('*');

  allElements.forEach(el => {
    // Skip certain elements that can be empty
    const skipTags = ['IMG', 'BR', 'HR', 'INPUT', 'META', 'LINK', 'AREA', 'BASE', 'COL', 'EMBED', 'PARAM', 'SOURCE', 'TRACK', 'WBR'];
    
    if (skipTags.includes(el.tagName)) {
      return;
    }

    if (!el.textContent.trim() && el.children.length === 0) {
      emptyElements.push(el);
    }
  });

  emptyElements.forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
}

/**
 * Cleans HTML string and returns cleaned string
 * @param {string} htmlString - HTML string to clean
 * @param {Object} options - Configuration options
 * @returns {string} Cleaned HTML string
 */
function cleanHTMLString(htmlString, options = {}) {
  if (typeof DOMParser === 'undefined') {
    throw new Error('DOMParser is not available. This function requires a browser environment.');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  cleanHTML(doc.body, options);
  
  return doc.body.innerHTML;
}

/**
 * Gets clean text content from an element (without scripts, styles, etc)
 * @param {HTMLElement} element - The element to extract text from
 * @param {Object} options - Configuration options
 * @returns {string} Clean text content
 */
function getCleanText(element, options = {}) {
  const clonedElement = element.cloneNode(true);
  cleanHTML(clonedElement, options);
  return clonedElement.textContent.trim();
}

/**
 * Preset configurations for common use cases
 */
const presets = {
  // Minimal cleaning - only remove scripts and hidden elements
  minimal: {
    removeScripts: true,
    removeStyles: false,
    removeComments: false,
    removeNoscript: true,
    removeIframes: false,
    removeSVG: false,
    removeHidden: true,
    removeEmptyElements: false
  },

  // Aggressive cleaning - remove everything except content
  aggressive: {
    removeScripts: true,
    removeStyles: true,
    removeComments: true,
    removeNoscript: true,
    removeIframes: true,
    removeSVG: true,
    removeHidden: true,
    removeEmptyElements: true,
    additionalSelectors: ['nav', 'footer', 'aside', 'header[role="banner"]']
  },

  // Content scraping - optimized for extracting main content
  scraping: {
    removeScripts: true,
    removeStyles: true,
    removeComments: true,
    removeNoscript: true,
    removeIframes: true,
    removeSVG: false,
    removeHidden: true,
    removeEmptyElements: false,
    additionalSelectors: ['script[type="application/ld+json"]']
  }
};

// Example usage in browser console:
/*
// Clean current page
cleanHTML(document.body);

// Clean with custom options
cleanHTML(document.body, {
  removeScripts: true,
  removeStyles: true,
  additionalSelectors: ['nav', '.ads', '#sidebar']
});

// Clean with preset
cleanHTML(document.body, presets.aggressive);

// Get clean text
const cleanText = getCleanText(document.querySelector('.content'));

// Clean HTML string
const cleanedHTML = cleanHTMLString('<div><script>alert("test")</script><p>Content</p></div>');
*/

// Export functions for use in browser or Node.js
if (typeof window !== 'undefined') {
  window.cleanHTML = cleanHTML;
  window.cleanHTMLString = cleanHTMLString;
  window.getCleanText = getCleanText;
  window.cleanHTMLPresets = presets;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanHTML,
    cleanHTMLString,
    getCleanText,
    removeComments,
    removeEmptyElements,
    presets
  };
}
