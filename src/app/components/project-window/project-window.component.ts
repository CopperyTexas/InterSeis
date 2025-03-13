import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectWindow } from '../../interfaces/project-window.model';
import { MatTabsModule } from '@angular/material/tabs';
import { NgForOf } from '@angular/common';
import { MainPageComponent } from '../main-page/main-page.component';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { ProjectInfo } from '../../interfaces/project-info.model';
import { MatDialog } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AddWindowButtonComponent } from '../add-window-button/add-window-button.component';
import { SaveProjectDialogComponent } from '../save-project-dialog/save-project-dialog.component';
import { FileService } from '../../services/file.service';
import { CloseConfirmationDialogComponent } from '../close-confirmation-dialog/close-confirmation-dialog.component';

declare const window: any; // Для работы с Electron API
@Component({
  selector: 'app-project-window',
  imports: [
    NgForOf,
    MainPageComponent,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatTabsModule,
    AddWindowButtonComponent,
  ],
  templateUrl: './project-window.component.html',
  styleUrl: './project-window.component.scss',
})
export class ProjectWindowComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  projectWindows: ProjectWindow[] = [
    { id: 1, projectInfo: null },
    { id: 2, projectInfo: null },
  ];
  private nextWindowId = 3;
  private subscription!: Subscription;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private fileService: FileService,
  ) {}

  ngOnInit(): void {
    // Подписка на обновление данных проекта
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        if (projectInfo) {
          this.updateProjectInfo(
            this.projectWindows[this.selectedTabIndex].id,
            projectInfo,
          );
        }
      },
    );

    // Подписка на событие "сохранить все проекты" от Electron
    if (window.electron) {
      window.electron.on('save-all-projects', () =>
        this.handleSaveAllProjects(),
      );
      window.electron.on('show-close-confirmation', () =>
        this.showCloseConfirmation(),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    if (window.electron) {
      window.electron.removeListener(
        'save-all-projects',
        this.handleSaveAllProjects,
      );
      window.electron.removeListener(
        'show-close-confirmation',
        this.showCloseConfirmation,
      );
    }
  }

  addTab(): void {
    const newWindow: ProjectWindow = {
      id: this.nextWindowId++,
      projectInfo: null,
    };
    this.projectWindows.push(newWindow);
    this.selectedTabIndex = this.projectWindows.length - 1;
  }

  removeTab(index: number, event: MouseEvent): void {
    event.stopPropagation();

    if (this.projectWindows.length > 1) {
      const windowToRemove = this.projectWindows[index];

      if (!windowToRemove.projectInfo) {
        this.closeTab(index);
      } else {
        const dialogRef = this.dialog.open(SaveProjectDialogComponent, {
          width: '300px',
          data: {},
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.fileService
              .saveProject(windowToRemove.projectInfo!)
              .then(() => this.closeTab(index))
              .catch((error) => console.error('Ошибка сохранения:', error));
          } else {
            this.closeTab(index);
          }
        });
      }
    }
  }

  private closeTab(index: number): void {
    this.projectWindows.splice(index, 1);
    if (this.selectedTabIndex >= this.projectWindows.length) {
      this.selectedTabIndex = this.projectWindows.length - 1;
    }
  }

  updateProjectInfo(windowId: number, projectInfo: ProjectInfo): void {
    const index = this.projectWindows.findIndex((win) => win.id === windowId);
    if (index !== -1) {
      this.projectWindows[index] = {
        ...this.projectWindows[index],
        projectInfo,
      };
    }
  }

  async handleSaveAllProjects(): Promise<void> {
    console.log('Начинается сохранение всех проектов...');

    try {
      for (const win of this.projectWindows) {
        if (win.projectInfo) {
          await this.fileService.saveProject(win.projectInfo);
          console.log(
            `Проект "${win.projectInfo.objectName}" успешно сохранён.`,
          );
        }
      }

      console.log('Сохранение всех проектов завершено.');
      window.electron.send('save-all-complete', true);
    } catch (error) {
      console.error('Ошибка сохранения проектов:', error);
      window.electron.send('save-all-complete', false);
    }
  }

  showCloseConfirmation(): void {
    const dialogRef = this.dialog.open(CloseConfirmationDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      window.electron.send('close-confirmation-response', result);
    });
  }
}
