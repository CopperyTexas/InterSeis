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
    event.stopPropagation(); // отменяем переключение вкладки
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
      // Создаем новый объект, чтобы Angular обнаружил изменение
      this.projectWindows[index] = {
        ...this.projectWindows[index],
        projectInfo,
      };
    }
  }
}
