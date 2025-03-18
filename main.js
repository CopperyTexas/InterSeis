const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const chardet = require('chardet');
const iconv = require('iconv-lite');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'resources', 'InterSeis.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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

  // Перехватываем событие закрытия и отправляем запрос подтверждения в рендер-процесс.
  mainWindow.on('close', (event) => {
    event.preventDefault();
    console.log('close window');
    mainWindow.webContents.send('close-confirmation-request');
  });

  // При полном закрытии окна освобождаем ссылку.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Отправляем лог после загрузки окна.
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send(
      'procedure-log',
      'Программа Electron запущена!',
    );
    setTimeout(() => {
      mainWindow.webContents.send(
        'procedure-log',
        'Проверка логов через 5 секунд',
      );
    }, 5000);
  });
}

app.whenReady().then(() => {
  createWindow();

  // Слушаем ответ на запрос закрытия окна из рендер-процесса.
  ipcMain.on('close-confirmation-response', async (event, choice) => {
    if (choice === 'save') {
      // Если выбран "сохранить", отправляем команду сохранения всех проектов.
      mainWindow.webContents.send('save-all-projects');
      // Если нужно дождаться сохранения, можно добавить await.
      // После чего убираем обработчик закрытия и инициируем закрытие окна:
      mainWindow.removeAllListeners('close');
      mainWindow.close();
    } else if (choice === 'dont-save') {
      // Убираем обработчик закрытия и закрываем окно.
      mainWindow.removeAllListeners('close');
      mainWindow.close();
    } else if (choice === 'cancel') {
      // Если выбран "отмена", окно остаётся открытым.
      // Ничего не делаем.
    }
  });

  ipcMain.handle('open-project-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Project Files', extensions: ['ips'] }],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });

  ipcMain.on('log-message', (event, message) => {
    console.log(`ЛОГ: ${message}`);
    if (mainWindow) {
      mainWindow.webContents.send('procedure-log', message);
    }
  });

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
              return null;
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
    const creationDate = new Date().toLocaleString('ru-RU');
    const userInfo = os.userInfo();
    const computerName = os.hostname();
    const project = {
      objectName,
      profileName,
      creationDate,
      user: userInfo.username,
      computer: computerName,
      filePath: folderPath,
      graph: [],
    };
    const sanitizedFileName =
      `${objectName}_${profileName}`.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_') +
      '.ips';
    const filePath = path.join(folderPath, sanitizedFileName);
    try {
      const content = JSON.stringify(project, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');
      return filePath;
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
      throw error;
    }
  });

  ipcMain.handle('read-text-file', async (event, filePath) => {
    try {
      const buffer = await fs.readFile(filePath);
      const encoding = chardet.detect(buffer);
      console.log(`Определенная кодировка для ${filePath}:`, encoding);
      return encoding && encoding.toLowerCase() !== 'utf-8'
        ? iconv.decode(buffer, encoding)
        : buffer.toString('utf-8');
    } catch (error) {
      console.error('Ошибка чтения файла:', error);
      throw error;
    }
  });

  ipcMain.handle('read-project', async (event, filePath) => {
    try {
      const buffer = await fs.readFile(filePath);
      const encoding = chardet.detect(buffer);
      return encoding && encoding.toLowerCase() !== 'utf-8'
        ? iconv.decode(buffer, encoding)
        : buffer.toString('utf-8');
    } catch (error) {
      console.error('Ошибка чтения проекта:', error);
      throw error;
    }
  });

  ipcMain.handle('save-project', async (event, projectData) => {
    try {
      let targetPath = projectData.filePath;
      if ((await fs.stat(targetPath).catch(() => null))?.isDirectory()) {
        const sanitizedFileName =
          `${projectData.objectName}_${projectData.profileName}`.replace(
            /[^a-zA-Zа-яА-Я0-9]/g,
            '_',
          ) + '.ips';
        targetPath = path.join(targetPath, sanitizedFileName);
      }
      await fs.writeFile(
        targetPath,
        JSON.stringify(projectData, null, 2),
        'utf-8',
      );
      return targetPath;
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
      throw error;
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
