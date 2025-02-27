import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';

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
  ) {}

  // Метод для переключения состояния меню: открытие/закрытие подменю
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  // Декоратор @HostListener отслеживает клики по документу.
  // Если клик происходит вне элемента компонента, меню закрывается.
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Проверяем, содержит ли DOM-элемент компонента (eRef.nativeElement) целевой элемент события.
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  // Обработчик клика по элементу меню
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

      case 'Сохранить':
        // Можно реализовать открытие другого окна или вызвать метод сохранения
        break;
      // Добавьте другие случаи по необходимости
      default:
        console.log('Выбрано:', item);
    }
  }
}
