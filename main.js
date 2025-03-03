const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os'); // для получения информации о пользователе и компьютере

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
    const allowedExtensions = ['.PAS', '.pc', '.txt', '.tab', '.ips'];
    try {
      const files = await fs.readdir(folderPath);
      return await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const stats = await fs.stat(filePath);
          if (!stats.isDirectory()) {
            const ext = path.extname(file).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
              return null; // Помечаем как "неподходящий"
            }
          }
          return {
            name: file,
            path: filePath,
            type: stats.isDirectory() ? 'folder' : 'file',
          };
        }),
      ).then((results) => results.filter((item) => item !== null));
    } catch (error) {
      console.error('Ошибка чтения папки:', error);
      return [];
    }
  });

  ipcMain.handle('create-project', async (event, projectData) => {
    const { objectName, profileName, folderPath } = projectData;
    const creationDate = new Date().toISOString();
    const userInfo = os.userInfo();
    const computerName = os.hostname();

    // Формируем базовый объект проекта
    const project = {
      objectName,
      profileName,
      creationDate,
      user: userInfo.username,
      computer: computerName,
      graph: [], // изначально пустой граф
    };

    const sanitizedObjectName = objectName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
    const sanitizedProfileName = profileName.replace(
      /[^a-zA-Zа-яА-Я0-9]/g,
      '_',
    );
    const fileName = `${sanitizedObjectName}_${sanitizedProfileName}.ips`;
    const filePath = path.join(folderPath, fileName);
    try {
      const content = JSON.stringify(project, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');
      return filePath; // возвращаем путь к созданному файлу
    } catch (error) {
      console.error('Ошибка создания файла проекта:', error);
      throw error;
    }
  });
  ipcMain.handle('open-project-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Project Files', extensions: ['ips'] }],
    });
    return result.filePaths[0] || null;
  });

  ipcMain.handle('read-project', async (event, filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error('Ошибка чтения проекта:', error);
      throw error;
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
