const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    icon: path.join(__dirname, 'resources', 'InterSeis.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    // В режиме разработки загружаем Angular Dev Server
    mainWindow.loadURL('http://localhost:4200');
    // Опционально открываем DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // В production режиме загружаем статичные файлы из dist
    const indexPath = path.join(
      __dirname,
      'dist',
      'InterSeis',
      'browser',
      'index.html',
    );
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
