const { contextBridge } = require('electron');

// Inject content script when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Create and inject the content script
  const script = document.createElement('script');
  script.src = 'data:text/javascript,' + encodeURIComponent(`
    // Content script code
    alert('Content script injected! PE no Carnaval page loaded successfully.');
  `);
  document.head.appendChild(script);
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to the renderer here
});