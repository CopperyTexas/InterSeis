import { Component, Input } from '@angular/core';
import { FileNode } from '../../interfaces/file-node';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-tree-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree-node.component.html',
  styleUrl: './file-tree-node.component.scss',
})
export class FileTreeNodeComponent {
  @Input() node!: FileNode;

  constructor(private fileService: FileService) {}

  async toggleNode(event: MouseEvent) {
    // Остановить всплытие события, чтобы клик по дочернему узлу не активировал клик родителя
    event.stopPropagation();

    // Инвертируем состояние папки
    this.node.isOpen = !this.node.isOpen;

    if (this.node.isOpen && !this.node.children) {
      // Загружаем содержимое, если папка открывается и дочерние узлы ещё не получены
      try {
        this.node.children = await this.fileService.getFolderContents(
          this.node.path,
        );
      } catch (error) {
        console.error('Ошибка при загрузке содержимого папки:', error);
      }
    } else if (!this.node.isOpen) {
      // Если папка закрывается, сворачиваем все вложенные узлы
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
}
