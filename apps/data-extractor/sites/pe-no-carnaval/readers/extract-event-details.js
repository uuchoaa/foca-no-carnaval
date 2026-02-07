/**
 * Extract detailed information from an individual event page
 * This reader is called for each event URL in parallel
 * 
 * @param {Document} document - The event page DOM
 * @param {Object} event - The original event data from output.json
 * @returns {Object} Detailed event information
 */
function extractEventDetails(document, event) {
  console.log(`[DETAIL-READER] Processing event: ${event.name} (${event.id})`);
  console.log(`[DETAIL-READER] URL: ${event.url}`);
  console.log(`[DETAIL-READER] Page title: ${document.title}`);
  
  // For now, just return basic info + page title
  return {
    pageTitle: document.title,
    contentLength: document.body.innerHTML.length,
    extractedAt: new Date().toISOString()
  };
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractEventDetails;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.extractEventDetails = extractEventDetails;
}
