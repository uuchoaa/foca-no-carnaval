/**
 * Extract carnival events from HTML content
 */
function extractEvents(content) {
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

  const events = [];
  
  // Find all date containers
  const dateContainers = document.querySelectorAll('.data-container');
  
  dateContainers.forEach(container => {
    // Extract date from h4 header
    const h4 = container.querySelector('h4');
    if (!h4) return;
    
    const headerText = h4.textContent.trim();
    // Format: "18/02/2026 - quarta-feira"
    const dateMatch = headerText.match(/(\d{2}\/\d{2}\/\d{4})\s*-\s*(.+)/);
    
    if (!dateMatch) return;
    
    const dateStr = dateMatch[1];
    const dayOfWeek = dateMatch[2];
    
    // Parse date components
    const [day, month, year] = dateStr.split('/');
    
    // Find all event items in this date container
    const eventItems = container.querySelectorAll('li');
    
    eventItems.forEach(li => {
      try {
        // Extract data from attributes
        const name = li.getAttribute('data-nome-evento') || '';
        const time = li.getAttribute('data-horario-evento') || '';
        const category = li.getAttribute('data-categoria-evento') || '';
        const typeStr = li.getAttribute('data-tipo-evento') || '';
        const city = li.getAttribute('data-cidade-evento') || '';
        
        // Parse types (comma-separated)
        const types = typeStr ? typeStr.split(',').map(t => t.trim()).filter(t => t) : [];
        
        // Extract nested span data
        const link = li.querySelector('a');
        const url = link ? link.getAttribute('href') || '' : '';
        
        const tituloSpan = li.querySelector('.titulo');
        const titleRaw = tituloSpan ? tituloSpan.textContent : name;
        // Remove extra whitespace and normalize
        const title = titleRaw.replace(/\s+/g, ' ').trim();
        
        const localSpan = li.querySelector('.local');
        const location = localSpan ? localSpan.textContent.trim() : '';
        
        const tipoEventoSpan = li.querySelector('.tipo_evento');
        const priceText = tipoEventoSpan ? tipoEventoSpan.textContent.trim().toLowerCase() : '';
        const isFree = priceText.includes('gratuito');
        
        // Generate ID from URL
        let id = '';
        if (url) {
          const urlMatch = url.match(/\/programacao\/([^\/]+)\/?$/);
          if (urlMatch) {
            id = urlMatch[1];
          }
        }
        
        // Create ISO datetime string
        // Format: YYYY-MM-DDTHH:MM:SS
        let dateISO = '';
        if (time) {
          const [hours, minutes] = time.split(':');
          dateISO = `${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
        } else {
          dateISO = `${year}-${month}-${day}T00:00:00`;
        }
        
        // Build event object
        const event = {
          id: id || `event-${dateStr.replace(/\//g, '-')}-${time.replace(':', '')}`,
          name: title,
          date: dateStr,
          dateISO: dateISO,
          dayOfWeek: dayOfWeek,
          time: time,
          category: category,
          types: types,
          city: city,
          location: location,
          isFree: isFree,
          url: url
        };
        
        events.push(event);
      } catch (error) {
        console.error('Error parsing event:', error);
      }
    });
  });
  
  return {
    events: events
  };
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractEvents;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.extractEvents = extractEvents;
}
