/**
 * Extract list items from HTML content
 */
function extractList(content) {
  let document;
  
  // Handle both Document and HTML string
  if (typeof content === 'string') {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      document = parser.parseFromString(content, 'text/html');
    } else {
      throw new Error('DOMParser not available. Please provide a Document object or use jsdom.');
    }
  } else {
    document = content;
  }

  const items = [];
  
  // Track current date being processed
  let currentDate = '';
  let currentDayOfWeek = '';
  
  // Find all elements in the event table
  const eventTable = document.querySelector('#event_table');
  if (!eventTable) {
    return { items: [] };
  }
  
  // Get all children of event_table
  const children = eventTable.children;
  
  for (let i = 0; i < children.length; i++) {
    const element = children[i];
    
    // Check if this is a date header (h1 element)
    if (element.tagName === 'H1') {
      const dateText = element.textContent.trim();
      // Parse "Domingo, 08/02" format
      const match = dateText.match(/([^,]+),\s*(\d{2}\/\d{2})/);
      if (match) {
        currentDayOfWeek = match[1].trim();
        currentDate = `${match[2]}/2026`; // Add year
      }
      continue;
    }
    
    // Check if this is an event box
    if (element.classList.contains('box_attraction')) {
      try {
        // Extract data attributes
        const id = element.getAttribute('data-id') || '';
        const stageId = element.getAttribute('data-stage-id') || '';
        const isStreetAttr = element.getAttribute('data-is-street') || 'false';
        const isStreet = isStreetAttr === 'true';
        
        // Extract stage name from .title div
        const titleDiv = element.querySelector('.title');
        const stage = titleDiv ? titleDiv.textContent.replace(/\s+/g, ' ').trim() : '';
        
        // Extract event title from .body span
        const bodySpan = element.querySelector('.body span');
        const title = bodySpan ? bodySpan.textContent.replace(/\s+/g, ' ').trim() : '';
        
        // Extract time from .time div
        const timeDiv = element.querySelector('.time');
        let time = '';
        if (timeDiv) {
          // Extract time text, removing whitespace
          const timeText = timeDiv.textContent.trim();
          const timeMatch = timeText.match(/(\d{2}:\d{2})/);
          if (timeMatch) {
            time = timeMatch[1];
          }
        }
        
        // Extract type from .attraction-type div
        const typeDiv = element.querySelector('.attraction-type b');
        const type = typeDiv ? typeDiv.textContent.trim() : '';
        
        // Build URL
        const url = `https://carnaval.recife.pe.gov.br/?attraction_id=${id}`;
        
        // Skip if no essential data
        if (!id || !title || !currentDate) continue;
        
        // Build item object
        const item = {
          id: id,
          title: title,
          date: currentDate,
          dayOfWeek: currentDayOfWeek,
          time: time,
          stage: stage,
          stageId: stageId,
          type: type,
          isStreet: isStreet,
          url: url
        };
        
        items.push(item);
      } catch (error) {
        console.error('Error parsing item:', error);
      }
    }
  }
  
  return {
    items: items
  };
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractList;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.extractList = extractList;
}
