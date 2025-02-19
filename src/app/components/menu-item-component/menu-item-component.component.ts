import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-component.component.html',
  styleUrl: './menu-item-component.component.scss',
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
