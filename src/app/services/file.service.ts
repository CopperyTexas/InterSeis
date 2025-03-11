import { Injectable } from '@angular/core';
import { ProjectInfo } from '../interfaces/project-info.model';

interface ElectronAPI {
  openFolderDialog: () => Promise<string | null>;

  readDirectory: (
    folderPath: string,
  ) => Promise<{ name: string; path: string; type: 'folder' | 'file' }[]>;
  createFolder: (folderPath: string, folderName: string) => Promise<void>;
  deleteFolder: (folderPath: string) => Promise<void>;
  createProject: (projectData: {
    objectName: string;
    profileName: string;
    folderPath: string;
  }) => Promise<string>;
  readProject: (filePath: string) => Promise<string>;
  openProjectFile: () => Promise<string | null>;
  readTextFile: (filePath: string) => Promise<string>;
  saveProject: (projectData: ProjectInfo) => Promise<string>;
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
  async readTextFile(filePath: string): Promise<string> {
    if (!window.electron) {
      throw new Error('Electron API не загружен.');
    }
    // Предполагаем, что в основном процессе у вас настроен IPC-обработчик 'read-text-file'
    return await window.electron.readTextFile(filePath);
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
  async createProject(projectData: {
    objectName: string;
    profileName: string;
    folderPath: string;
  }): Promise<string> {
    if (!window.electron) {
      throw new Error('Electron API не загружен.');
    }
    return await window.electron.createProject(projectData);
  }
  async saveProject(projectData: ProjectInfo): Promise<string> {
    if (!window.electron) {
      throw new Error('Electron API не загружен.');
    }
    return await window.electron.saveProject(projectData);
  }

  async selectProjectFile(): Promise<string | null> {
    if (!window.electron) {
      console.error('Electron API не загружен.');
      return null;
    }
    // Здесь можно вызвать IPC-метод для открытия диалога выбора файла с фильтром .ips
    return await window.electron.openProjectFile();
  }
  async readProject(filePath: string): Promise<any> {
    if (!window.electron) {
      throw new Error('Electron API не загружен.');
    }
    const content = await window.electron.readProject(filePath);
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Ошибка парсинга содержимого проекта:', e);
      throw e;
    }
  }
}
