const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onNewLog: (callback) => {
    ipcRenderer.on('new-log', (event, logData) => {
      callback(logData);
    });
  }
});