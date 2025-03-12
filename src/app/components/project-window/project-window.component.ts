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
import { Procedure } from '../../interfaces/procedure.model';
import { SaveProjectDialogComponent } from '../save-project-dialog/save-project-dialog.component';
import { FileService } from '../../services/file.service';

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
    // Подписываемся на изменения в ProjectService и обновляем только активное окно
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        if (projectInfo) {
          const activeWindow = this.projectWindows[this.selectedTabIndex];
          this.updateProjectInfo(activeWindow.id, projectInfo);
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addTab(): void {
    // Создаем новое окно
    const newWindow: ProjectWindow = {
      id: this.nextWindowId++,
      projectInfo: null,
    };
    this.projectWindows.push(newWindow);
    // Переключаем фокус на новое окно
    this.selectedTabIndex = this.projectWindows.length - 1;
  }

  removeTab(index: number, event: MouseEvent): void {
    event.stopPropagation(); // чтобы клик по кнопке закрытия не переключал вкладку

    if (this.projectWindows.length > 1) {
      const windowToRemove = this.projectWindows[index];
      if (!windowToRemove.projectInfo) {
        this.projectWindows.splice(index, 1);
        if (this.selectedTabIndex >= this.projectWindows.length) {
          this.selectedTabIndex = this.projectWindows.length - 1;
        }
      } else {
        // Открываем диалог подтверждения сохранения
        const dialogRef = this.dialog.open(SaveProjectDialogComponent, {
          width: '300px',
          data: {}, // не передаём никаких данных
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          // Если пользователь подтвердил сохранение
          if (confirmed) {
            const projectData = this.projectWindows[index].projectInfo;
            if (projectData) {
              // Сохраняем проект для этого окна
              this.fileService
                .saveProject(projectData)
                .then((filePath: string) => {
                  console.log('Проект успешно сохранён:', filePath);
                  // Затем удаляем вкладку
                  this.projectWindows.splice(index, 1);
                  if (this.selectedTabIndex >= this.projectWindows.length) {
                    this.selectedTabIndex = this.projectWindows.length - 1;
                  }
                })
                .catch((error: any) => {
                  console.error('Ошибка сохранения проекта:', error);
                  // При ошибке можно решить, удалять ли окно или нет
                });
            } else {
              // Если проект не загружен, просто удаляем вкладку
              this.projectWindows.splice(index, 1);
              if (this.selectedTabIndex >= this.projectWindows.length) {
                this.selectedTabIndex = this.projectWindows.length - 1;
              }
            }
          } else {
            // Если пользователь решил не сохранять, просто удаляем вкладку
            this.projectWindows.splice(index, 1);
            if (this.selectedTabIndex >= this.projectWindows.length) {
              this.selectedTabIndex = this.projectWindows.length - 1;
            }
          }
        });
      }
    }
  }

  updateProjectInfo(windowId: number, projectInfo: ProjectInfo): void {
    const index = this.projectWindows.findIndex((win) => win.id === windowId);
    if (index !== -1) {
      // Создаем новый объект, чтобы Angular обнаружил изменение
      this.projectWindows[index] = {
        ...this.projectWindows[index],
        projectInfo,
      };
    }
  }

  // Пример метода в компоненте, управляющем окном:
  updateWindowGraph(newGraph: Procedure[]): void {
    const window = this.projectWindows[this.selectedTabIndex];
    if (window && window.projectInfo) {
      window.projectInfo = { ...window.projectInfo, graph: newGraph };
      // При сохранении проекта потом этот обновлённый объект используется для записи файла
      this.projectService.setProjectInfo(window.projectInfo);
    }
  }
}
