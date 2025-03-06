import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectWindow } from '../../interfaces/project-window.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { NgForOf } from '@angular/common';
import { MainPageComponent } from '../main-page/main-page.component';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectInfo } from '../../interfaces/project-info.model';

@Component({
  selector: 'app-project-window',
  imports: [MatTabGroup, MatTab, NgForOf, MainPageComponent],
  templateUrl: './project-window.component.html',
  styleUrl: './project-window.component.scss',
})
export class ProjectWindowComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  projectWindows: ProjectWindow[] = [
    { id: 1, projectInfo: null },
    { id: 2, projectInfo: null },
    { id: 3, projectInfo: null },
  ];
  private subscription!: Subscription;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Если вы хотите, чтобы глобальное состояние обновлялось, можно подписаться,
    // но в нашем случае лучше обновлять только выбранное окно.
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        if (projectInfo) {
          // Обновляем только активное окно
          this.updateProjectInfo(
            this.projectWindows[this.selectedTabIndex].id,
            projectInfo,
          );
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateProjectInfo(windowId: number, projectInfo: ProjectInfo): void {
    const index = this.projectWindows.findIndex((win) => win.id === windowId);
    if (index !== -1) {
      // Обновляем объект окна с новой информацией
      this.projectWindows[index] = {
        ...this.projectWindows[index],
        projectInfo,
      };
    }
  }
}
