import { Component } from '@angular/core';
import { MenuItemComponent } from '../menu-item-component/menu-item-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenuItemComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  menuItems = [
    {
      title: 'Проект',
      iconPath: '/assets/icons/Project.svg',
      submenu: ['Новый проект', 'Открыть', 'Сохранить'],
    },
    {
      title: 'Утилиты',
      iconPath: '/assets/icons/Settings.svg',
      submenu: ['Настройки', 'Инструменты', 'Логи'],
    },
    {
      title: 'Помощь',
      iconPath: '/assets/icons/Help.svg',
      submenu: ['FAQ', 'Поддержка', 'Документация'],
    },
  ];
}
