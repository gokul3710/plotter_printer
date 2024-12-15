const io = require('socket.io-client');

const host = "192.168.45.115";
const socket = io(`http://${host}:3000`);

socket.on('connect', () => {
  const clientId = socket.id;
  window.electronAPI.setClientId(null, clientId);
});

socket.on('printJob', (data) => {
  window.electronAPI.onMessage(null, data);
});

function registerPrinter(printerId) {
  const payload = { printerId: printerId };
  socket.emit('registerPrinter', payload, (response) => {
    console.log('Server Response:', response);
  });
}

module.exports = { registerPrinter };
