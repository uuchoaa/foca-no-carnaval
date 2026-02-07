/**
 * HTML sanitizer adapted for Node.js/jsdom environment
 * Removes unnecessary nodes during scraping to reduce token count
 */

const { JSDOM } = require('jsdom');

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
    try {
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
    } catch (error) {
      console.warn(`[SANITIZER] Error removing selector ${selector}:`, error.message);
    }
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
 * Works in both browser and jsdom environments
 * @param {HTMLElement|Document} rootElement - The root element
 */
function removeComments(rootElement) {
  // Get the document from the root element
  const doc = rootElement.ownerDocument || rootElement;
  
  const iterator = doc.createNodeIterator(
    rootElement,
    128, // NodeFilter.SHOW_COMMENT
    null
  );

  const comments = [];
  let currentNode;

  while ((currentNode = iterator.nextNode())) {
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
 * Uses jsdom in Node.js environment
 * @param {string} htmlString - HTML string to clean
 * @param {Object} options - Configuration options
 * @returns {string} Cleaned HTML string
 */
function cleanHTMLString(htmlString, options = {}) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  
  cleanHTML(document.body, options);
  
  return document.body.innerHTML;
}

/**
 * Cleans a full HTML document, returning valid HTML structure
 * Also normalizes whitespace in the output
 * @param {string} htmlString - HTML string to clean
 * @param {Object} options - Configuration options
 * @returns {string} Cleaned, valid HTML string with full document structure
 */
function cleanHTMLDocument(htmlString, options = {}) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  
  // Remove head content (not useful for scraping)
  if (document.head) {
    // Keep only title if it exists
    const title = document.head.querySelector('title');
    const titleText = title ? title.textContent : '';
    document.head.innerHTML = '';
    if (titleText) {
      const newTitle = document.createElement('title');
      newTitle.textContent = titleText;
      document.head.appendChild(newTitle);
    }
  }
  
  // Clean the body
  if (document.body) {
    cleanHTML(document.body, options);
  }
  
  // Get full HTML structure
  let html = document.documentElement.outerHTML;
  
  // Add DOCTYPE if not present
  if (!html.trim().toLowerCase().startsWith('<!doctype')) {
    html = '<!DOCTYPE html>\n' + html;
  }
  
  // Remove excessive blank lines (more than 2 consecutive newlines)
  html = html.replace(/\n\s*\n\s*\n+/g, '\n\n');
  
  // Remove trailing whitespace on each line
  html = html.replace(/[ \t]+$/gm, '');
  
  return html;
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

module.exports = {
  cleanHTML,
  cleanHTMLString,
  cleanHTMLDocument,
  getCleanText,
  removeComments,
  removeEmptyElements,
  presets
};
