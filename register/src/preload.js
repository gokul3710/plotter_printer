const { contextBridge, ipcRenderer } = require('electron');
const { io } = require('socket.io-client');
const shell = require('electron').shell;
let socket = null;

contextBridge.exposeInMainWorld('electronShell', {
  openExternal: (url) => {
    shell.openExternal(url);
  },
});

contextBridge.exposeInMainWorld('webSocket', {
  connect: (url, authToken) => {
    if (!socket) {
      // Pass the Authorization header with Bearer token
      socket = io(url, {
        extraHeaders: {
          "authorization": `Bearer ${authToken}`,
        },
      });
    }

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
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
  registerPrinter: (payload) =>
    socket.emit('registerPrinter', payload, (response) => {
      ipcRenderer.send('printerRegistered', response);
    })
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args)
});
