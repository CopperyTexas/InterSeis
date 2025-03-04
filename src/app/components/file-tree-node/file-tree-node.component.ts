import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileNode } from '../../interfaces/file-node';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReadFileDialogComponent } from '../read-file-dialog/read-file-dialog.component';

@Component({
  selector: 'app-file-tree-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree-node.component.html',
  styleUrls: ['./file-tree-node.component.scss'],
})
export class FileTreeNodeComponent {
  @Input() node!: FileNode;
  @Output() folderSelected = new EventEmitter<string>();

  private clickTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
  ) {}

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    // Запускаем таймер для обработки одиночного клика
    this.clickTimeout = setTimeout(() => {
      this.toggleNode();
      this.clickTimeout = null;
    }, 250);
  }

  async onDoubleClick(event: MouseEvent): Promise<void> {
    event.stopPropagation();
    // Если существует таймер одиночного клика, отменяем его
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    if (this.node.type === 'folder') {
      // При двойном клике на папку вместо простого toggle отправляем событие,
      // чтобы родительский компонент сделал эту папку главной (навигация в неё)
      this.folderSelected.emit(this.node.path);
    } else if (this.node.type === 'file') {
      // Для файла проверяем поддерживаемое расширение
      const lowerName = this.node.name.toLowerCase();
      if (lowerName.endsWith('.ips') || lowerName.endsWith('.txt')) {
        await this.openFileInDialog();
      }
    }
  }

  private async toggleNode(): Promise<void> {
    // Логика переключения состояния папки (открыть/закрыть)
    this.node.isOpen = !this.node.isOpen;
    if (this.node.isOpen && !this.node.children) {
      try {
        this.node.children = await this.fileService.getFolderContents(
          this.node.path,
        );
      } catch (error) {
        console.error('Ошибка при загрузке содержимого папки:', error);
      }
    } else if (!this.node.isOpen) {
      this.collapseChildren(this.node);
    }
  }

  private collapseChildren(node: FileNode): void {
    if (node.children) {
      for (const child of node.children) {
        if (child.type === 'folder' && child.isOpen) {
          child.isOpen = false;
          this.collapseChildren(child);
        }
      }
    }
  }

  private async openFileInDialog(): Promise<void> {
    try {
      const content = await this.fileService.readTextFile(this.node.path);
      this.dialog.open(ReadFileDialogComponent, {
        width: '600px',
        data: { content },
      });
    } catch (error) {
      console.error('Ошибка при открытии файла:', error);
    }
  }
}
