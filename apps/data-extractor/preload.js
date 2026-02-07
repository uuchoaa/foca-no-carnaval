const { contextBridge } = require('electron');

// Inject content script when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Create and inject the content script
  const script = document.createElement('script');
  script.src = 'data:text/javascript,' + encodeURIComponent(`
    (function() {
      console.log('[EXTRACTOR] Content script injected successfully');
      
      // Wait a bit for the page to fully load
      setTimeout(() => {
        console.log('[EXTRACTOR] Starting to look for "Carregar mais eventos" button');
        // clickLoadMoreButton();
      }, 2000);

      // Wait a bit for the page to fully load
      setTimeout(() => {
        console.log('[EXTRACTOR] Starting to look how to parse HTML);
        // clickLoadMoreButton();
      }, 2000);

      function clickLoadMoreButton() {
        // Search for the "Carregar mais eventos" button
        const buttons = document.querySelectorAll('button, a, div[role="button"], span[role="button"]');
        let loadMoreButton = null;

        for (let button of buttons) {
          const text = button.textContent.trim();
          if (text.includes('Carregar mais eventos') || text.includes('carregar mais eventos')) {
            loadMoreButton = button;
            break;
          }
        }

        if (loadMoreButton) {
          console.log('[EXTRACTOR] Found "Carregar mais eventos" button, clicking...');
          loadMoreButton.click();
          
          // Wait for content to load, then check again
          setTimeout(() => {
            console.log('[EXTRACTOR] Waiting for new events to load...');
            clickLoadMoreButton();
          }, 3000);
        } else {
          console.log('[EXTRACTOR] "Carregar mais eventos" button not found. All events loaded!');
          console.log('[EXTRACTOR] Process completed successfully');
        }
      }
    })();
  `);
  document.head.appendChild(script);
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to the renderer here
});