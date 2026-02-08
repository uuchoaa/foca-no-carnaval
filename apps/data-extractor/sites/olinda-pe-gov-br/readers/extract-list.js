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
  
  // Helper function to parse date from text like "QUINTA-FEIRA (12FEV)"
  function parseDate(dateText) {
    const match = dateText.match(/\((\d{2})[A-Z]{3}\)/i);
    if (match) {
      const day = match[1];
      return `${day}/02/2026`; // February 2026
    }
    return '';
  }
  
  // Helper function to extract day of week from text like "QUINTA-FEIRA (12FEV)"
  function parseDayOfWeek(dateText) {
    const match = dateText.match(/^([A-ZÁÉÍÓÚÂÊÔÃÕÇ-]+)/i);
    if (match) {
      return match[1].trim();
    }
    return '';
  }
  
  // Helper function to slugify text for IDs
  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Find all paragraphs in the document
  const paragraphs = document.querySelectorAll('p');
  
  let currentDate = '';
  let currentDayOfWeek = '';
  let stage = '';
  
  paragraphs.forEach(p => {
    const text = p.textContent.trim();
    
    // Check if this is a stage name (appears before date headers)
    if (text.includes('Palco') || text.includes('palco')) {
      stage = text;
      return;
    }
    
    // Check if this is a date header with <strong> tag
    const strongElement = p.querySelector('strong');
    if (strongElement) {
      const strongText = strongElement.textContent.trim();
      // Check if it matches date pattern like "QUINTA-FEIRA (12FEV)"
      if (strongText.match(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ-]+\s*\(\d{2}[A-Z]{3}\)/i)) {
        currentDate = parseDate(strongText);
        currentDayOfWeek = parseDayOfWeek(strongText);
        return;
      }
    }
    
    // If we have a current date, extract events from this paragraph
    if (currentDate && text.startsWith('–')) {
      try {
        // Split by <br> tags or newlines to get individual events
        const events = [];
        
        // Check if paragraph has br tags
        if (p.innerHTML.includes('<br>')) {
          // Parse HTML to get text split by br tags
          const parts = p.innerHTML.split(/<br\s*\/?>/i);
          parts.forEach(part => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = part;
            const eventText = tempDiv.textContent.trim();
            if (eventText && eventText.startsWith('–')) {
              events.push(eventText.substring(1).trim());
            }
          });
        } else {
          // Single event in paragraph
          const eventText = text.substring(1).trim();
          if (eventText) {
            events.push(eventText);
          }
        }
        
        // Create an item for each event
        events.forEach((eventTitle, index) => {
          if (!eventTitle) return;
          
          const id = `${currentDate.replace(/\//g, '-')}-${slugify(eventTitle)}`;
          
          const item = {
            id: id,
            title: eventTitle,
            date: currentDate,
            dayOfWeek: currentDayOfWeek,
            stage: stage,
            url: 'https://www.olinda.pe.gov.br/programacao-do-carnaval-2026-coloca-todo-mundo-na-folia-em-olinda/'
          };
          
          items.push(item);
        });
      } catch (error) {
        console.error('Error parsing event:', error);
      }
    }
  });
  
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
