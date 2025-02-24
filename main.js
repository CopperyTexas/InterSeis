const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'resources', 'InterSeis.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Подключаем preload.js
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, 'dist', 'InterSeis', 'browser', 'index.html'),
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('openFolderDialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    return result.filePaths[0] || null;
  });

  ipcMain.handle('readDirectory', async (_, folderPath) => {
    try {
      const files = await fs.readdir(folderPath);
      return await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            path: filePath,
            type: stats.isDirectory() ? 'folder' : 'file',
          };
        }),
      );
    } catch (error) {
      console.error('Ошибка чтения папки:', error);
      return [];
    }
  });

  // Обработчик создания папки
  ipcMain.handle('create-folder', async (_, folderPath, folderName) => {
    const newFolderPath = path.join(folderPath, folderName);
    try {
      await fs.mkdir(newFolderPath);
      return;
    } catch (err) {
      console.error('Ошибка создания папки:', err);
      throw err;
    }
  });

  // Обработчик удаления папки
  ipcMain.handle('delete-folder', async (_, folderPath) => {
    try {
      await fs.rm(folderPath, { recursive: true, force: true });
      return;
    } catch (err) {
      console.error('Ошибка удаления папки:', err);
      throw err;
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
