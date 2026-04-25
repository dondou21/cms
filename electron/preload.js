const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Expose any required IPC channels here.
    // Example: sendCommand: (command) => ipcRenderer.send('app-command', command),
    onAppClose: (callback) => ipcRenderer.on('app-close', () => callback()),
});
