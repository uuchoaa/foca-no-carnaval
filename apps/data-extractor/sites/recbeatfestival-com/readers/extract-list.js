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

  // Find the programacao section
  const programacaoSection = document.querySelector('#programacao');
  if (!programacaoSection) {
    return { items: [] };
  }

  // Find all containers and filter those with date headings (days)
  const allContainers = programacaoSection.querySelectorAll('div[class*="elementor-element"]');
  const dayContainers = Array.from(allContainers).filter(container =>
    container.querySelector('h2.elementor-heading-title')
  );
  dayContainers.forEach((dayContainer) => {
    let currentDate = '';
    let currentLocation = 'Cais da Alfândega'; // Default location

    // Extract date from heading - look for headings with just numbers
    const dateHeadings = dayContainer.querySelectorAll('h2.elementor-heading-title');
    dateHeadings.forEach(heading => {
      const dateText = heading.textContent.trim();

      // Extract date if it's just a number
      if (/^\d+$/.test(dateText)) {
        const day = parseInt(dateText);
        if (day >= 14 && day <= 17) {
          currentDate = `2026-02-${day.toString().padStart(2, '0')}`;
        }
      }
    });

    // Find all show elements in this day container
    const showElements = dayContainer.querySelectorAll('.elementor-icon-list-text');

    showElements.forEach(showEl => {
      const showText = showEl.textContent.trim();

      // Match show format: "HHhMM - ARTIST (STATE/COUNTRY)" or "HHh - ARTIST (STATE/COUNTRY)"
      const showMatch = showText.match(/^(\d{1,2})h(\d{0,2})\s*-\s*(.+?)\s*\(([^)]+)\)$/);

      if (showMatch && currentDate) {
        const [, hour, minute, artist, stateOrCountry] = showMatch;

        // Format time as HH:MM
        const formattedHour = hour.padStart(2, '0');
        const formattedMinute = minute ? minute.padStart(2, '0') : '00';
        const time = `${formattedHour}:${formattedMinute}`;

        // Create ID: date-time-artist (normalized)
        const artistNormalized = artist.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const id = `${currentDate.replace(/-/g, '')}-${time.replace(':', '')}-${artistNormalized}`;

        const item = {
          id: id,
          title: `${artist.trim()} (${stateOrCountry.trim()})`,
          date: currentDate,
          time: time,
          location: currentLocation,
          artist: artist.trim(),
          state: stateOrCountry.trim(),
          url: ''
        };

        items.push(item);
      }
    });
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
