/**
 * Extract detailed information from an individual item page
 * This reader is called for each item URL in parallel
 * 
 * @param {Document} document - The item page DOM
 * @param {Object} item - The original item data from output.json
 * @returns {Object} Detailed item information (only NEW fields not in list)
 */
function extractDetails(document, item) {
  // Extract data from the modal
  const modal = document.querySelector('#attraction-modal');
  
  if (!modal) {
    console.warn('[DETAIL-READER] Modal not found');
    return {}; // Return empty object if modal not found
  }
  
  // Extract description from modal (NEW field)
  const descEl = modal.querySelector('#description-truncated');
  const description = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';
  
  // Extract address (NEW field)
  const addressEl = modal.querySelector('#address');
  const address = addressEl ? addressEl.textContent.trim() : '';
  
  // Only return NEW fields that aren't already in the list
  return {
    description: description,
    address: address
  };
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractDetails;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.extractDetails = extractDetails;
}
