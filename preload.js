const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
  readDirectory: (folderPath) =>
    ipcRenderer.invoke('readDirectory', folderPath),
  createFolder: (folderPath, folderName) =>
    ipcRenderer.invoke('create-folder', folderPath, folderName),
  deleteFolder: (folderPath) => ipcRenderer.invoke('delete-folder', folderPath),
});
