import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-path',
  imports: [CommonModule],
  templateUrl: './folder-path.component.html',
  styleUrl: './folder-path.component.scss',
})
export class FolderPathComponent {
  @Input() currentPath: string | null = null;
  @Output() pathChanged = new EventEmitter<string>();

  get pathSegments(): string[] {
    if (!this.currentPath) return [];
    const normalized = this.currentPath.replace(/\\/g, '/');
    // Разбиваем путь и фильтруем пустые элементы
    const segments = normalized
      .split('/')
      .filter((segment) => segment.length > 0);
    // Если путь начинается с '/', добавляем корневой разделитель в начало
    if (normalized.startsWith('/')) {
      segments.unshift('/');
    }
    return segments;
  }

  navigateTo(index: number): void {
    const newPath = this.pathSegments.slice(0, index + 1).join('/');
    this.pathChanged.emit(newPath);
  }
}
