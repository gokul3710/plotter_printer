const { contextBridge, ipcRenderer } = require('electron');
const { io } = require('socket.io-client');
let socket = null;

contextBridge.exposeInMainWorld('webSocket', {
  connect: (url) => {
    
    if (!socket) {
      socket = io(url);
    }

    socket.on('connect', () => {
      window.postMessage({ type: 'connected', clientId: socket.id });
    });

    socket.on('printJob', (data) => {
      window.postMessage({ type: 'printJob', data });
    });

    return socket;
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  registerPrinter: (printerId) =>
    socket.emit('registerPrinter', {printerId}, (response) => {
      ipcRenderer.send('printerRegistered', response);
    })
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args)
});
