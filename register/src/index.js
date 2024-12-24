const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

if(process.defaultApp) {
  if(process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('printer-register', process.execPath, [path.resolve(process.argv[1])]);
  }
}else{
  app.setAsDefaultProtocolClient('printer-register');
}

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

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}else{
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}

app.on('open-url', (event, url) => {
  const authToken = url.split('authToken=')[1];
  mainWindow.webContents.send('setAuthToken', authToken);
  // event.preventDefault();
  // mainWindow.webContents.send('setAuthToken', url);
})

// IPC handler for when printer is registered
ipcMain.on('printerRegistered', (event, response) => {
  // Send the response back to the renderer
  mainWindow.webContents.send('printerRegistrationResponse', response);
});
