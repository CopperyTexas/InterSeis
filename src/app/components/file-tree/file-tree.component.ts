import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { FileNode } from '../../interfaces/file-node';
import { FileTreeNodeComponent } from '../file-tree-node/file-tree-node.component';
import { FolderPathComponent } from '../folder-path/folder-path.component';
import { FileTreeOptionsComponent } from '../file-tree-options/file-tree-options.component';

import { FileTreeTab } from '../../interfaces/tab.model';
import { ProjectInfo } from '../../interfaces/project-info.model';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [
    CommonModule,
    FileTreeNodeComponent,
    FolderPathComponent,
    FileTreeOptionsComponent,
  ],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent implements OnInit {
  @Input() projectInfo!: ProjectInfo | null;
  @Input() tab!: FileTreeTab;
  @Input() activeTabId!: number | null;

  currentFolderPath: string | null = null;
  fileTree: FileNode[] = [];
  isLoading = false;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    if (this.projectInfo && this.projectInfo.filePath) {
      // Устанавливаем путь проекта один раз при открытии
      this.currentFolderPath = this.projectInfo.filePath;
      this.loadFolder(this.currentFolderPath);
    }
  }

  private loadFolder(folderPath: string): void {
    this.isLoading = true;
    this.fileService
      .getFolderContents(folderPath)
      .then((content) => (this.fileTree = content))
      .catch((error) => console.error('Ошибка при загрузке папки:', error))
      .finally(() => (this.isLoading = false));
  }

  // Эти методы позволят пользователю навигировать по папкам вручную:
  onFolderChanged(result: {
    folderPath: string;
    folderContent: FileNode[];
  }): void {
    this.currentFolderPath = result.folderPath;
    this.fileTree = result.folderContent;
  }

  onPathChanged(newPath: string): void {
    this.currentFolderPath = newPath;
    this.fileService
      .getFolderContents(newPath)
      .then((content) => (this.fileTree = content))
      .catch((error) => console.error('Ошибка при переходе:', error));
  }

  onFolderSelected(newPath: string): void {
    this.currentFolderPath = newPath;
    this.fileService
      .getFolderContents(newPath)
      .then((content) => (this.fileTree = content))
      .catch((error) => console.error('Ошибка при переходе:', error));
  }
}
