const { contextBridge, ipcRenderer } = require('electron');

const validChannels = [
  'openFolderDialog',
  'readDirectory',
  'create-folder',
  'delete-folder',
  'create-project',
  'read-project',
  'open-project-file',
  'read-text-file',
  'save-project',
  'log-message',
  'procedure-log',
  'save-all-projects',
  'show-close-confirmation',
];

contextBridge.exposeInMainWorld('electron', {
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
  readDirectory: (folderPath) =>
    ipcRenderer.invoke('readDirectory', folderPath),
  createFolder: (folderPath, folderName) =>
    ipcRenderer.invoke('create-folder', folderPath, folderName),
  deleteFolder: (folderPath) => ipcRenderer.invoke('delete-folder', folderPath),
  createProject: (projectData) =>
    ipcRenderer.invoke('create-project', projectData),
  readProject: (filePath) => ipcRenderer.invoke('read-project', filePath),
  openProjectFile: () => ipcRenderer.invoke('open-project-file'),
  readTextFile: (filePath) => ipcRenderer.invoke('read-text-file', filePath),
  saveProject: (projectData) => ipcRenderer.invoke('save-project', projectData),

  // 🔹 Отправка сообщений в main.js
  send: (channel, ...args) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    } else {
      console.warn(
        `Попытка отправить сообщение по запрещённому каналу: ${channel}`,
      );
    }
  },

  // 🔹 Логирование в UI
  sendLog: (message) => ipcRenderer.send('log-message', message),

  // 🔹 Подписка на события (универсальный `on`)
  on: (channel, callback) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    } else {
      console.warn(`Попытка подписки на запрещённый канал: ${channel}`);
    }
  },

  // 🔹 Получение логов от main.js (более безопасный вариант)
  onLog: (callback) => {
    ipcRenderer.removeAllListeners('procedure-log');
    ipcRenderer.on('procedure-log', (_event, message) => callback(message));
  },
});
