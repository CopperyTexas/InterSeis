import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { FileNode } from '../../interfaces/file-node';
import { FileTreeNodeComponent } from '../file-tree-node/file-tree-node.component';
import { FolderPathComponent } from '../folder-path/folder-path.component';
import { FileTreeOptionsComponent } from '../file-tree-options/file-tree-options.component';
import { FileTabComponent } from '../file-tab/file-tab.component';
import { FileTreeTab } from '../../interfaces/tab.model';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/project.service';

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
export class FileTreeComponent implements OnInit, OnDestroy {
  @Input() tab!: FileTreeTab;
  @Input() activeTabId!: number | null;
  fileTree: FileNode[] = [];
  isLoading = false;
  currentFolderPath: string | null = null;
  private subscription!: Subscription;

  constructor(
    private fileService: FileService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    // Подписываемся на изменения информации о проекте
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        if (projectInfo && projectInfo.filePath) {
          this.loadFolder(projectInfo.filePath);
        }
      },
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private loadFolder(folderPath: string): void {
    this.isLoading = true;
    this.fileService
      .getFolderContents(folderPath)
      .then((content) => (this.fileTree = content))
      .catch((error) => console.error('Ошибка при загрузке папки:', error))
      .finally(() => (this.isLoading = false));
  }
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
