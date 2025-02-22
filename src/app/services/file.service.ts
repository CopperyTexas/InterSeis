import { Injectable } from '@angular/core';

interface ElectronAPI {
  openFolderDialog: () => Promise<string | null>;
  readDirectory: (
    folderPath: string,
  ) => Promise<{ name: string; path: string; type: 'folder' | 'file' }[]>;
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
  async selectFolder(): Promise<
    { name: string; path: string; type: 'folder' | 'file' }[] | null
  > {
    if (!window.electron) {
      console.error(
        'Electron API не загружен. Убедитесь, что preload.js работает.',
      );
      return null;
    }
    const folderPath = await window.electron.openFolderDialog();
    if (!folderPath) return null;
    return this.getFolderContents(folderPath);
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
}
