const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'resources', 'InterSeis.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Подключаем preload.js
      contextIsolation: true, // Изоляция контекста (безопасность)
      enableRemoteModule: false,
      nodeIntegration: false, // Запрещаем полный доступ к Node.js
    },
  });

  if (process.env.NODE_ENV === 'development') {
    // В режиме разработки загружаем Angular Dev Server
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools(); // Открываем DevTools
  } else {
    // В production загружаем статичные файлы Angular
    mainWindow.loadFile(
      path.join(__dirname, 'dist', 'InterSeis', 'browser', 'index.html'),
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 🔹 Теперь IPC-события регистрируются после `app.whenReady()`
app.whenReady().then(() => {
  createWindow();

  // 📂 Обработчик выбора папки
  ipcMain.handle('openFolderDialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    return result.filePaths[0] || null;
  });

  // 📁 Читаем содержимое папки
  ipcMain.handle('readDirectory', async (_, folderPath) => {
    try {
      const files = fs.readdirSync(folderPath);
      return files.map((file) => {
        const filePath = path.join(folderPath, file);
        return {
          name: file,
          path: filePath,
          type: fs.statSync(filePath).isDirectory() ? 'folder' : 'file',
        };
      });
    } catch (error) {
      console.error('Ошибка чтения папки:', error);
      return [];
    }
  });
});

// Закрываем приложение при закрытии всех окон (кроме macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Повторное открытие окна при активации (macOS)
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
