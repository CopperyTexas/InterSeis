import { Component, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { FileNode } from '../../interfaces/file-node';
import { FileTreeNodeComponent } from '../file-tree-node/file-tree-node.component';
import { FolderPathComponent } from '../folder-path/folder-path.component';
import { FileTreeOptionsComponent } from '../file-tree-options/file-tree-options.component';
import { FileTabComponent } from '../file-tab/file-tab.component';
import { FileTreeTab } from '../../interfaces/tab.model';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [
    CommonModule,
    FileTreeNodeComponent,
    FolderPathComponent,
    FileTreeOptionsComponent,
    FileTabComponent,
  ],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent {
  @Input() tab!: FileTreeTab;
  @Input() activeTabId!: number | null;
  fileTree: FileNode[] = [];
  isLoading = false;
  currentFolderPath: string | null = null;

  constructor(private fileService: FileService) {}

  // Обработчик события из FileTreeOptionsComponent
  onFolderChanged(result: { folderPath: string; folderContent: FileNode[] }) {
    this.currentFolderPath = result.folderPath;
    this.fileTree = result.folderContent;
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
}
