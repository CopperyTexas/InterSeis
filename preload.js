const { contextBridge, ipcRenderer } = require('electron');

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

  on: (channel, callback) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  },
});
