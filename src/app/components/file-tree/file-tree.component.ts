import { Component } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { FileNode } from '../../interfaces/file-node';
import { FileTreeNodeComponent } from '../file-tree-node/file-tree-node.component';
import { MatDialog } from '@angular/material/dialog';
import { FolderNameDialogComponent } from '../folder-name-dialog/folder-name-dialog.component';
import { FolderPathComponent } from '../folder-path/folder-path.component';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, FileTreeNodeComponent, FolderPathComponent],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent {
  fileTree: FileNode[] = [];

  isLoading = false;

  currentFolderPath: string | null = null;

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
  ) {}

  async selectFolder() {
    this.isLoading = true;
    try {
      const result = await this.fileService.selectFolder();
      if (result !== null) {
        this.fileTree = result.folderContent;
        // Сохраняем реальный путь к выбранной папке
        this.currentFolderPath = result.folderPath;
      } else {
        this.fileTree = [];
        this.currentFolderPath = null;
      }
    } catch (error) {
      console.error('Ошибка при выборе папки:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async createFolder() {
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

          this.fileTree = await this.fileService.getFolderContents(
            this.currentFolderPath!,
          );
        } catch (error) {
          console.error('Ошибка создания папки:', error);
        }
      }
    });
  }

  async deleteCurrentFolder() {
    if (!this.currentFolderPath) {
      console.error('Нет выбранной папки для удаления.');
      return;
    }
    if (!confirm('Вы действительно хотите удалить эту папку?')) {
      return;
    }
    try {
      await this.fileService.deleteFolder(this.currentFolderPath);
      // Вычисляем родительский путь:
      const parentPath = this.getParentPath(this.currentFolderPath);
      this.currentFolderPath = parentPath;
      // Обновляем дерево файлов, загружая содержимое родительской папки
      this.fileTree = await this.fileService.getFolderContents(parentPath);
    } catch (error) {
      console.error('Ошибка при удалении папки:', error);
    }
  }

  onPathChanged(newPath: string) {
    this.currentFolderPath = newPath;
    this.fileService
      .getFolderContents(newPath)
      .then((content) => (this.fileTree = content))
      .catch((error) => console.error('Ошибка при переходе:', error));
  }

  onFolderSelected(newPath: string) {
    this.currentFolderPath = newPath;

    this.fileService
      .getFolderContents(newPath)
      .then((content) => (this.fileTree = content))
      .catch((error) => console.error('Ошибка при переходе:', error));
  }

  private getParentPath(currentPath: string): string {
    // Нормализуем разделители (для Windows и Unix)
    const normalized = currentPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    // Удаляем последний сегмент (название удаляемой папки)
    parts.pop();
    return parts.join('/');
  }
}
