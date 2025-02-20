import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NavbarComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatIcon,
    CommonModule,
    MatButton,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
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
