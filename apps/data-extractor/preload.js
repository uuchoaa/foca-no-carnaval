/**
 * Generic preload script for pipeline execution
 * Receives pipeline steps via IPC and executes them in the renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Inject pipeline executor when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  console.log('[PRELOAD] Pipeline executor ready');
  
  // Listen for interaction execution
  ipcRenderer.on('pipeline:run-interaction', (event, { code, stepConfig }) => {
    console.log('[PRELOAD] Executing interaction...');
    
    try {
      // Create a done callback
      const done = () => {
        console.log('[PRELOAD] Interaction completed');
        ipcRenderer.send('pipeline:interaction-done', { success: true });
      };
      
      // Inject and execute the interaction code
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          ${code}
          
          // Execute the interaction module
          const interactionFn = (typeof module !== 'undefined' && module.exports) || window.loadAllEvents;
          if (typeof interactionFn === 'function') {
            const done = () => {
              window.postMessage({ type: 'interaction-done' }, '*');
            };
            interactionFn(document, done);
          } else {
            console.error('[INTERACTION] Module did not export a function');
            window.postMessage({ type: 'interaction-error', error: 'Module did not export a function' }, '*');
          }
        })();
      `;
      document.head.appendChild(script);
      
      // Listen for completion from injected script
      window.addEventListener('message', (event) => {
        if (event.data.type === 'interaction-done') {
          ipcRenderer.send('pipeline:interaction-done', { success: true });
        } else if (event.data.type === 'interaction-error') {
          ipcRenderer.send('pipeline:interaction-done', { 
            success: false, 
            error: event.data.error 
          });
        }
      });
      
    } catch (error) {
      console.error('[PRELOAD] Interaction error:', error);
      ipcRenderer.send('pipeline:interaction-done', { 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // Listen for snapshot capture request
  ipcRenderer.on('pipeline:capture-snapshot', () => {
    console.log('[PRELOAD] Capturing snapshot...');
    
    try {
      const html = document.documentElement.outerHTML;
      console.log(`[PRELOAD] Captured ${html.length} characters`);
      ipcRenderer.send('pipeline:snapshot-data', html);
    } catch (error) {
      console.error('[PRELOAD] Snapshot error:', error);
      ipcRenderer.send('pipeline:snapshot-data', '');
    }
  });
  
  // Listen for reader execution
  ipcRenderer.on('pipeline:run-reader', (event, { code, stepConfig }) => {
    console.log('[PRELOAD] Executing reader...');
    
    try {
      // Inject and execute the reader code
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          ${code}
          
          try {
            // Execute the reader module
            // Try multiple ways to get the exported function
            let readerFn = null;
            
            // Check if module.exports was set
            if (typeof module !== 'undefined' && module.exports && typeof module.exports === 'function') {
              readerFn = module.exports;
            }
            // Otherwise look for common window exports
            else if (typeof window !== 'undefined') {
              readerFn = window.extractEvents || window.extractList || window.extractDetails;
            }
            
            if (typeof readerFn === 'function') {
              const result = readerFn(document);
              window.postMessage({ 
                type: 'reader-done', 
                success: true, 
                data: result 
              }, '*');
            } else {
              console.error('[READER] Module did not export a function');
              window.postMessage({ 
                type: 'reader-done', 
                success: false, 
                error: 'Module did not export a function' 
              }, '*');
            }
          } catch (error) {
            console.error('[READER] Execution error:', error);
            window.postMessage({ 
              type: 'reader-done', 
              success: false, 
              error: error.message 
            }, '*');
          }
        })();
      `;
      document.head.appendChild(script);
      
      // Listen for result from injected script
      window.addEventListener('message', (event) => {
        if (event.data.type === 'reader-done') {
          ipcRenderer.send('pipeline:reader-data', event.data);
        }
      });
      
    } catch (error) {
      console.error('[PRELOAD] Reader error:', error);
      ipcRenderer.send('pipeline:reader-data', { 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // Listen for writer execution
  ipcRenderer.on('pipeline:run-writer', (event, { code, stepConfig }) => {
    console.log('[PRELOAD] Executing writer...');
    
    try {
      // Inject and execute the writer code
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          ${code}
          
          try {
            // Execute the writer module
            const writerFn = (typeof module !== 'undefined' && module.exports) || window.writer;
            if (typeof writerFn === 'function') {
              writerFn(document);
              window.postMessage({ type: 'writer-done', success: true }, '*');
            } else {
              console.error('[WRITER] Module did not export a function');
              window.postMessage({ 
                type: 'writer-done', 
                success: false, 
                error: 'Module did not export a function' 
              }, '*');
            }
          } catch (error) {
            console.error('[WRITER] Execution error:', error);
            window.postMessage({ 
              type: 'writer-done', 
              success: false, 
              error: error.message 
            }, '*');
          }
        })();
      `;
      document.head.appendChild(script);
      
      // Listen for completion from injected script
      window.addEventListener('message', (event) => {
        if (event.data.type === 'writer-done') {
          ipcRenderer.send('pipeline:writer-done', event.data);
        }
      });
      
    } catch (error) {
      console.error('[PRELOAD] Writer error:', error);
      ipcRenderer.send('pipeline:writer-done', { 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // Listen for parallel reader execution (used by browser pool)
  ipcRenderer.on('pipeline:run-parallel-reader', (event, { code, itemData, channelId }) => {
    console.log('[PRELOAD] Executing parallel reader...');
    
    try {
      // Inject and execute the reader code
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          ${code}
          
          try {
            // Execute the reader module with item data
            // Try multiple ways to get the exported function
            let readerFn = null;
            
            // Check if module.exports was set
            if (typeof module !== 'undefined' && module.exports && typeof module.exports === 'function') {
              readerFn = module.exports;
            }
            // Otherwise look for common window exports
            else if (typeof window !== 'undefined') {
              readerFn = window.extractEventDetails || window.extractDetails || window.extractList;
            }
            
            if (typeof readerFn === 'function') {
              const itemData = ${JSON.stringify(itemData)};
              const result = readerFn(document, itemData);
              window.postMessage({ 
                type: 'parallel-reader-done', 
                success: true, 
                data: result,
                channelId: '${channelId}'
              }, '*');
            } else {
              console.error('[PARALLEL-READER] Module did not export a function');
              window.postMessage({ 
                type: 'parallel-reader-done', 
                success: false, 
                error: 'Module did not export a function',
                channelId: '${channelId}'
              }, '*');
            }
          } catch (error) {
            console.error('[PARALLEL-READER] Execution error:', error);
            window.postMessage({ 
              type: 'parallel-reader-done', 
              success: false, 
              error: error.message,
              channelId: '${channelId}'
            }, '*');
          }
        })();
      `;
      document.head.appendChild(script);
      
      // Listen for result from injected script
      window.addEventListener('message', (msgEvent) => {
        if (msgEvent.data.type === 'parallel-reader-done' && msgEvent.data.channelId === channelId) {
          ipcRenderer.send(channelId, msgEvent.data);
        }
      });
      
    } catch (error) {
      console.error('[PRELOAD] Parallel reader error:', error);
      ipcRenderer.send(channelId, { 
        success: false, 
        error: error.message 
      });
    }
  });
});

// Expose API to renderer (currently empty, can be extended)
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to the renderer here
});
