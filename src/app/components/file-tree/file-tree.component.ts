import { Component } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { FileNode } from '../../interfaces/file-node';
import { FileTreeNodeComponent } from '../file-tree-node/file-tree-node.component';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, FileTreeNodeComponent],
  templateUrl: './file-tree.component.html',
  styleUrl: './file-tree.component.scss',
})
export class FileTreeComponent {
  fileTree: FileNode[] = [];
  isLoading = false;

  constructor(private fileService: FileService) {}

  async selectFolder() {
    this.isLoading = true;
    try {
      const folderContent = await this.fileService.selectFolder();
      this.fileTree = folderContent ?? [];
    } catch (error) {
      console.error('Ошибка при выборе папки:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
