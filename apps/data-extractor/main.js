const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
let logWindow;

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

function createWindow() {
  // Create the log window first
  createLogWindow();

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

  // Load the PE no Carnaval website
  mainWindow.loadURL('https://penocarnaval.com.br/programacao/');

  // Capture console logs from the renderer process and output to STDOUT and log window
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

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});