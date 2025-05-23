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
import { FileService } from '../../services/file.service';
import { CloseConfirmationDialogComponent } from '../close-confirmation-dialog/close-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  // Определяем слушатель один раз
  private saveAllListener = this.handleSaveAllProjects.bind(this);

  constructor(
    private projectService: ProjectService,
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Подписываемся на изменения в ProjectService и обновляем только активное окно
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        if (projectInfo) {
          const activeWindow = this.projectWindows[this.selectedTabIndex];
          this.updateProjectInfo(activeWindow.id, projectInfo);
        }
      },
    );
    if (window.electron && window.electron.on) {
      window.electron.on('close-confirmation-request', () => {
        console.log('Получено событие close-confirmation-request');

        this.openCloseConfirmationDialog();
      });
    }
  }
  openCloseConfirmationDialog(): void {
    const dialogRef = this.dialog.open(CloseConfirmationDialogComponent, {
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(`Результат закрытия диалога: ${result}`);

      if (result === 'save') {
        console.log(
          'Пользователь выбрал "Сохранить". Запускаем сохранение всех проектов...',
        );
        await this.handleSaveAllProjects(); // Ждём завершения сохранения
      }

      if (window.electron) {
        window.electron.send('close-confirmation-response', result);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (window.electron && window.electron.removeListener) {
      window.electron.removeListener('save-all-projects', this.saveAllListener);
    }
  }

  addTab(): void {
    this.projectWindows.push({
      id: this.nextWindowId++,
      projectInfo: null,
    });
    this.selectedTabIndex = this.projectWindows.length - 1;
  }

  removeTab(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.projectWindows.length > 1) {
      this.projectWindows.splice(index, 1);
      if (this.selectedTabIndex >= this.projectWindows.length) {
        this.selectedTabIndex = this.projectWindows.length - 1;
      }
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
    const projectToSave = this.projectWindows.filter((win) => win.projectInfo);
    if (projectToSave.length === 0) {
      console.warn('Нет открытых проектов');
      this.snackBar.open(
        'Нет загруженных проектов для сохранения.',
        'Закрыть',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        },
      );
      return;
    }
    for (const win of this.projectWindows) {
      if (win.projectInfo) {
        try {
          const savedPath = await this.fileService.saveProject(win.projectInfo);
          console.log(
            `Проект "${win.projectInfo.objectName}" сохранён в ${savedPath}`,
          );
        } catch (error) {
          console.error(
            `Ошибка сохранения проекта "${win.projectInfo.objectName}":`,
            error,
          );
        }
      } else {
        console.log('Окно без загруженного проекта — сохранение пропущено.');
      }
    }

    console.log('✅ Все проекты сохранены.');

    // Отправляем сигнал в main.js, что можно закрывать приложение
    if (window.electron) {
      window.electron.send('projects-saved');
    }
  }
}
