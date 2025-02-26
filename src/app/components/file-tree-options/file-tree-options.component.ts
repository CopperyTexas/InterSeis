import { Component, EventEmitter, Output } from '@angular/core';
import { FolderNameDialogComponent } from '../folder-name-dialog/folder-name-dialog.component';
import { FileNode } from '../../interfaces/file-node';
import { FileService } from '../../services/file.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-file-tree-options',
  imports: [],
  templateUrl: './file-tree-options.component.html',
  styleUrl: './file-tree-options.component.scss',
})
export class FileTreeOptionsComponent {
  @Output() folderChanged = new EventEmitter<{
    folderPath: string;
    folderContent: FileNode[];
  }>();
  fileTree: FileNode[] = [];
  isLoading = false;

  currentFolderPath: string | null = null;

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
  ) {}
  // Выбор папки через диалог, после чего сохраняется путь и содержимое папки
  async selectFolder(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.fileService.selectFolder();
      if (result !== null) {
        this.currentFolderPath = result.folderPath;
        this.fileTree = result.folderContent;
        // Эмитируем событие с новым путем и содержимым
        this.folderChanged.emit({
          folderPath: result.folderPath,
          folderContent: result.folderContent,
        });
      } else {
        this.currentFolderPath = null;
        this.fileTree = [];
        this.folderChanged.emit({ folderPath: '', folderContent: [] });
      }
    } catch (error) {
      console.error('Ошибка при выборе папки:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Создание новой папки в текущей выбранной директории
  async createFolder(): Promise<void> {
    if (!this.currentFolderPath) {
      console.error('Нет выбранной папки для создания новой папки.');
      return;
    }

    const dialogRef = this.dialog.open(FolderNameDialogComponent, {
      width: '300px',
      data: { folderName: '' },
    });

    dialogRef.afterClosed().subscribe(async (folderName) => {
      if (folderName) {
        try {
          await this.fileService.createFolder(
            this.currentFolderPath!,
            folderName,
          );
          // Обновляем содержимое текущей папки после создания новой
          const content = await this.fileService.getFolderContents(
            this.currentFolderPath!,
          );
          this.fileTree = content;
          this.folderChanged.emit({
            folderPath: this.currentFolderPath!,
            folderContent: content,
          });
        } catch (error) {
          console.error('Ошибка создания папки:', error);
        }
      }
    });
  }

  // Удаление текущей выбранной папки с переходом на родительский уровень
  async deleteCurrentFolder(): Promise<void> {
    if (!this.currentFolderPath) {
      console.error('Нет выбранной папки для удаления.');
      return;
    }
    if (!confirm('Вы действительно хотите удалить эту папку?')) {
      return;
    }
    try {
      await this.fileService.deleteFolder(this.currentFolderPath);
      // Вычисляем родительский путь
      const parentPath = this.getParentPath(this.currentFolderPath);
      this.currentFolderPath = parentPath;
      // Обновляем содержимое родительской папки
      const content = await this.fileService.getFolderContents(parentPath);
      this.fileTree = content;
      this.folderChanged.emit({
        folderPath: parentPath,
        folderContent: content,
      });
    } catch (error) {
      console.error('Ошибка при удалении папки:', error);
    }
  }

  // Метод для вычисления родительского пути из текущего пути
  private getParentPath(currentPath: string): string {
    // Нормализуем разделители для Windows/Unix
    const normalized = currentPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    // Удаляем последний сегмент (название текущей папки)
    parts.pop();
    return parts.join('/');
  }
}
