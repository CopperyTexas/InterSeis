import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-component.component.html',
  styleUrl: './menu-item-component.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '100ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' }),
        ),
      ]),
    ]),
  ],
})
export class MenuItemComponent {
  @Input() iconPath!: string; // Путь к иконке
  @Input() title!: string; // Название пункта
  @Input() submenu: string[] = []; // Подменю
  isOpen = false;
  isHovered = false;
  constructor(private eRef: ElementRef) {}
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  protected readonly onmouseenter = onmouseenter;
}
