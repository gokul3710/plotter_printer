const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getPrinters: () => ipcRenderer.invoke('get-printers'),
    sendToBackend: (message) => ipcRenderer.send('send-to-backend', message),
});
