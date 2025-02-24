import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileNode } from '../../interfaces/file-node';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';

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

  constructor(private fileService: FileService) {}

  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.clickTimeout = setTimeout(() => {
      this.toggleNode();
      this.clickTimeout = null;
    }, 250);
  }

  onDoubleClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    if (this.node.type === 'folder') {
      this.folderSelected.emit(this.node.path);
    }
  }

  async toggleNode() {
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
}
