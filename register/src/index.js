const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, './index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('setWsUrl', process.env.WS_URL);
  });
};

// Electron app lifecycle events
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handler for when printer is registered
ipcMain.on('printerRegistered', (event, response) => {
  // Send the response back to the renderer
  mainWindow.webContents.send('printerRegistrationResponse', response);
});
