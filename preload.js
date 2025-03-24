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
  'close-confirmation-request',
  'close-confirmation-response',
  'projects-saved',
  'open-file-dialog',
  'open-save-dialog',
];

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  openSaveDialog: (options) => ipcRenderer.invoke('open-save-dialog', options),
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
  send: (channel, ...args) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    } else {
      console.warn(`⚠️ Запрещённая попытка отправки: ${channel}`);
    }
  },

  sendLog: (message) => ipcRenderer.send('log-message', message),
  on: (channel, callback) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    } else {
      console.warn(`⚠️ Запрещённая подписка: ${channel}`);
    }
  },

  onLog: (callback) => {
    ipcRenderer.removeAllListeners('procedure-log');
    ipcRenderer.on('procedure-log', (_event, message) => callback(message));
  },
});
