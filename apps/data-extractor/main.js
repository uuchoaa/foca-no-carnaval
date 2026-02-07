const { app, BrowserWindow } = require('electron');
const path = require('path');
const SiteRegistry = require('./core/registry');
const { runPipeline } = require('./core/pipeline-runner');

let mainWindow;
let logWindow;

// Get site name from CLI args
const args = process.argv.slice(2);
const siteName = args.find(arg => !arg.startsWith('--')) || 'pe-no-carnaval';

console.log(`[MAIN] Starting extraction for site: ${siteName}`);

function createLogWindow() {
  // Create the log window
  logWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: 100,
    y: 100,
    title: 'Extraction Logs',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'log-preload.js')
    }
  });

  // Load the log viewer HTML
  logWindow.loadFile(path.join(__dirname, 'log-viewer.html'));

  logWindow.on('closed', () => {
    logWindow = null;
  });
}

async function createWindow() {
  // Create the log window first
  createLogWindow();

  // Load site configuration
  const registry = new SiteRegistry();
  const config = registry.getSite(siteName);
  
  if (!config) {
    console.error(`[MAIN] Site not found: ${siteName}`);
    console.error(`[MAIN] Available sites: ${registry.listSites().join(', ')}`);
    app.quit();
    return;
  }
  
  console.log(`[MAIN] Loaded config for ${config.name}`);
  console.log(`[MAIN] URL: ${config.url}`);
  console.log(`[MAIN] Pipeline steps: ${config.pipeline.length}`);

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    x: 920,
    y: 100,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Capture console logs from the renderer process
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levels = ['LOG', 'WARNING', 'ERROR', 'DEBUG', 'INFO'];
    const logLevel = levels[level] || 'LOG';
    const logMessage = `[RENDERER ${logLevel}] ${message}`;
    
    // Output to STDOUT
    console.log(logMessage);
    
    // Send to log window
    if (logWindow && !logWindow.isDestroyed()) {
      logWindow.webContents.send('new-log', {
        level: logLevel,
        message: message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Open DevTools in development (optional)
  // mainWindow.webContents.openDevTools();

  // Load the site URL
  console.log(`[MAIN] Loading ${config.url}...`);
  await mainWindow.loadURL(config.url);
  
  console.log('[MAIN] Page loaded, waiting for DOMContentLoaded...');
  
  // Wait for page to be ready
  await mainWindow.webContents.executeJavaScript('document.readyState');
  
  // Small delay to ensure everything is initialized
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('[MAIN] Starting pipeline...');
  
  // Run the pipeline
  try {
    const result = await runPipeline(mainWindow, config);
    
    if (result.success) {
      console.log('[MAIN] ✓ Pipeline completed successfully!');
      console.log(`[MAIN] Results saved to ${config._sitePath}`);
    } else {
      console.error('[MAIN] ✗ Pipeline failed:', result.error);
    }
    
    // Keep window open for inspection
    console.log('[MAIN] Pipeline complete. Close window to exit.');
    
  } catch (error) {
    console.error('[MAIN] Pipeline error:', error);
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
