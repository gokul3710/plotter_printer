const { contextBridge, ipcRenderer } = require('electron');
const { io } = require('socket.io-client');
let socket = null;

contextBridge.exposeInMainWorld('webSocket', {
  connect: (url) => {
    
    if (!socket) {
      socket = io(url);
    }

    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id);
      window.postMessage({ type: 'connected', clientId: socket.id });
    });

    socket.on('printJob', (data) => {
      console.log('Received print job:', data);
      window.postMessage({ type: 'printJob', data });
    });

    return socket;
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  registerPrinter: (printerId) =>
    socket.emit('registerPrinter', {printerId}, (response) => {
      console.log('Server Response:', response);
      // messageElement.textContent = `Server Response: ${JSON.stringify(response, null, 2)}`;
      ipcRenderer.send('printerRegistered', response);
    })
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args)
});
