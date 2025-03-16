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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // ✅ Отправляем лог после загрузки окна
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

  ipcMain.handle('open-project-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Project Files', extensions: ['ips'] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null; // Если пользователь отменил выбор
    }

    return result.filePaths[0]; // Возвращаем путь к файлу
  });
  // ✅ Глобальный обработчик логов
  ipcMain.on('log-message', (event, message) => {
    console.log(`ЛОГ: ${message}`);
    if (mainWindow) {
      mainWindow.webContents.send('procedure-log', message);
    }
  });

  // ✅ Обработчик закрытия окна с подтверждением
  app.on('before-quit', async (event) => {
    if (!mainWindow) return;

    console.log('Приложение хочет закрыться.');
    mainWindow.webContents.send('procedure-log', 'Приложение закрывается...');

    event.preventDefault(); // Остановим закрытие, пока пользователь не подтвердит

    try {
      const userChoice = await new Promise((resolve) => {
        ipcMain.once('close-confirmation-response', (_, response) =>
          resolve(response),
        );
        mainWindow.webContents.send('show-close-confirmation');
      });

      if (userChoice === 'save') {
        console.log('Пользователь выбрал "Сохранить"');
        const saveResult = await new Promise((resolve) => {
          ipcMain.once('save-all-complete', (_, success) => resolve(success));
          mainWindow.webContents.send('save-all-projects');
        });

        if (saveResult) {
          console.log('Проекты сохранены, закрываем приложение.');
          app.exit();
        } else {
          console.log('Ошибка при сохранении, закрытие отменено.');
        }
      } else if (userChoice === 'dont-save') {
        console.log('Пользователь выбрал "Не сохранять", закрываем окно.');
        app.exit();
      } else {
        console.log('Пользователь отменил закрытие.');
      }
    } catch (error) {
      console.error('Ошибка в обработчике закрытия окна:', error);
    }
  });

  // ✅ Обработчик открытия папки
  ipcMain.handle('openFolderDialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    return result.filePaths[0] || null;
  });

  // ✅ Чтение содержимого папки
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
              return null; // Фильтруем неподходящие файлы
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

  // ✅ Обработчик создания проекта
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

  // ✅ Чтение текстового файла
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

  // ✅ Чтение проекта
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

  // ✅ Сохранение проекта
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
