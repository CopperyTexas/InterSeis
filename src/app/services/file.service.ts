import { Injectable } from '@angular/core';

interface ElectronAPI {
  openFolderDialog: () => Promise<string | null>;

  readDirectory: (
    folderPath: string,
  ) => Promise<{ name: string; path: string; type: 'folder' | 'file' }[]>;
  createFolder: (folderPath: string, folderName: string) => Promise<void>;
  deleteFolder: (folderPath: string) => Promise<void>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  async selectFolder(): Promise<{
    folderPath: string;
    folderContent: { name: string; path: string; type: 'folder' | 'file' }[];
  } | null> {
    if (!window.electron) {
      console.error(
        'Electron API не загружен. Убедитесь, что preload.js работает.',
      );
      return null;
    }
    const folderPath = await window.electron.openFolderDialog();
    if (!folderPath) return null;
    const folderContent = await this.getFolderContents(folderPath);
    return { folderPath, folderContent };
  }

  async getFolderContents(
    folderPath: string,
  ): Promise<{ name: string; path: string; type: 'folder' | 'file' }[]> {
    if (!window.electron) {
      console.error('Electron API не загружен.');
      return [];
    }
    return await window.electron.readDirectory(folderPath);
  }

  async createFolder(folderPath: string, folderName: string): Promise<void> {
    if (!window.electron) {
      console.error('Electron API не загружен.');
      return;
    }
    return await window.electron.createFolder(folderPath, folderName);
  }

  async deleteFolder(folderPath: string): Promise<void> {
    if (!window.electron) {
      console.error('Electron API не загружен.');
      return;
    }
    return await window.electron.deleteFolder(folderPath);
  }
}
