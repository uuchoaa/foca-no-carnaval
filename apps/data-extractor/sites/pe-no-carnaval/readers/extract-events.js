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
  
  // Find all data containers
  const containers = document.querySelectorAll('.data-container');
  
  containers.forEach(container => {
    // Get section name from h3 (e.g., "Tradicional", "Indicamos")
    const h3 = container.querySelector('h3');
    const sectionType = h3 ? h3.textContent.trim().toLowerCase() : '';
    
    // Find all event items in this container
    const eventItems = container.querySelectorAll('li[data-categoria-evento]');
    
    eventItems.forEach(li => {
      try {
        // Extract data from attributes
        const category = li.getAttribute('data-categoria-evento') || '';
        const typeAttr = li.getAttribute('data-tipo-evento') || '';
        const city = li.getAttribute('data-cidade-evento') || '';
        
        // Build types array: [typeAttr, sectionType]
        const types = [];
        if (typeAttr) types.push(typeAttr);
        if (sectionType) types.push(sectionType);
        
        // Extract nested span data
        const link = li.querySelector('a');
        const url = link ? link.getAttribute('href') || '' : '';
        
        // Extract date from .data span
        const dataSpan = li.querySelector('.data');
        const dateText = dataSpan ? dataSpan.textContent.trim() : '';
        // Date format: " 07/02" (with leading space sometimes)
        const dateShort = dateText.trim();
        
        // Extract day of week from .diasemana span
        const diasemanaSpan = li.querySelector('.diasemana');
        const dayOfWeek = diasemanaSpan ? diasemanaSpan.childNodes[0]?.textContent.trim() : '';
        
        // Extract title from .titulo span (nested inside .diasemana)
        const tituloSpan = li.querySelector('.titulo');
        const title = tituloSpan ? tituloSpan.textContent.replace(/\s+/g, ' ').trim() : '';
        
        // Extract location from .local span
        const localSpan = li.querySelector('.local');
        const location = localSpan ? localSpan.textContent.replace(/\s+/g, ' ').trim() : '';
        
        // Extract time from .horario span
        const horarioSpan = li.querySelector('.horario');
        let time = '';
        if (horarioSpan) {
          // Remove icon and extract time (e.g., " 09:00")
          const horarioText = horarioSpan.textContent.trim();
          const timeMatch = horarioText.match(/(\d{2}:\d{2})/);
          if (timeMatch) {
            time = timeMatch[1];
          }
        }
        
        // Extract price info from .tipo_evento span
        const tipoEventoSpan = li.querySelector('.tipo_evento');
        const priceText = tipoEventoSpan ? tipoEventoSpan.textContent.trim().toLowerCase() : '';
        const isFree = priceText.includes('gratuito');
        
        // Build full date string (need to infer year from current context or default to 2026)
        const currentYear = new Date().getFullYear();
        const dateStr = dateShort.includes('/') ? `${dateShort}/2026` : '';
        
        // Parse date components
        let day = '', month = '', year = '2026';
        if (dateStr) {
          [day, month, year] = dateStr.split('/');
        }
        
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
        if (time && dateStr) {
          const [hours, minutes] = time.split(':');
          dateISO = `${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
        } else if (dateStr) {
          dateISO = `${year}-${month}-${day}T00:00:00`;
        }
        
        // Skip if no essential data
        if (!title || !dateStr) return;
        
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
