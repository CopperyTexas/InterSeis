import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';
import { OpenProjectDialogComponent } from '../open-project-dialog/open-project-dialog.component';
import { SaveProjectDialogComponent } from '../save-project-dialog/save-project-dialog.component';
import { ProjectService } from '../../services/project.service';
import { FileService } from '../../services/file.service';
import { ProcedureGraphComponent } from '../procedure-graph/procedure-graph.component';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-component.component.html',
  styleUrl: './menu-item-component.component.scss',
  animations: [
    // Анимация fadeInOut для плавного появления и исчезновения элемента
    trigger('fadeInOut', [
      // Анимация появления (при добавлении элемента в DOM)
      transition(':enter', [
        // Начальное состояние: элемент прозрачный и смещён вверх на 10px
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        // Плавное появление за 100мс до полной видимости и нормального положения
        animate(
          '100ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      // Анимация исчезновения (при удалении элемента из DOM)
      transition(':leave', [
        // Плавное исчезновение за 100мс с уменьшением прозрачности и смещением вверх
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' }),
        ),
      ]),
    ]),
  ],
})
export class MenuItemComponent {
  // Input-параметр: путь к иконке, которая будет отображаться для пункта меню
  @ViewChild('procedureGraph') procedureGraph!: ProcedureGraphComponent;
  @Input() iconPath!: string;
  // Input-параметр: название пункта меню
  @Input() title!: string;
  // Input-параметр: массив строк для подменю
  @Input() submenu: string[] = [];

  // Флаг, указывающий, открыто ли меню (открытие подменю)
  isOpen = false;
  // Флаг, указывающий, находится ли курсор над элементом меню
  isHovered = false;

  // Инжектируем ElementRef для доступа к DOM-элементу компонента

  constructor(
    private eRef: ElementRef,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private fileService: FileService,
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  onMenuItemClick(item: string): void {
    // Пример переключения диалоговых окон:
    switch (item) {
      case 'Новый проект':
        this.dialog.open(NewProjectDialogComponent, {
          width: '400px',
          data: {
            /* необходимые данные */
          },
        });
        break;
      case 'Открыть':
        this.dialog.open(OpenProjectDialogComponent, {
          width: '400px',
          data: {
            /* данные, необходимые для сохранения проекта */
          },
        });
        break;

      case 'Сохранить': {
        const dialogRef = this.dialog.open(SaveProjectDialogComponent, {
          width: '300px',
          data: {},
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            // Получаем актуальный проект из ProjectService
            const projectData = this.projectService.getCurrentProjectInfo();
            if (projectData) {
              this.fileService
                .saveProject(projectData)
                .then((filePath: string) => {
                  console.log('Проект успешно сохранён:', filePath);
                  // Здесь можно вывести уведомление для пользователя, например, через MatSnackBar
                })
                .catch((error: any) => {
                  console.error('Ошибка сохранения проекта:', error);
                });
            }
          }
        });
        break;
      }

      // Добавьте другие случаи по необходимости
      default:
        console.log('Выбрано:', item);
    }
  }
}
