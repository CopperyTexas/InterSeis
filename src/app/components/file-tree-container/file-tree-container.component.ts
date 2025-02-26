import { Component } from '@angular/core';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { CommonModule } from '@angular/common';
import { FileTabComponent } from '../file-tab/file-tab.component';
import { FileTreeTab } from '../../interfaces/tab.model';

@Component({
  selector: 'app-file-tree-container',
  imports: [FileTreeComponent, CommonModule, FileTabComponent],
  templateUrl: './file-tree-container.component.html',
  styleUrl: './file-tree-container.component.scss',
})
export class FileTreeContainerComponent {
  // Массив вкладок. Каждый объект имеет уникальный id.
  tabs: FileTreeTab[] = [];

  // Счетчик для генерации уникальных id.
  private nextTabId = 1;

  // Метод добавления вкладки, если их меньше двух.
  addTab(): void {
    if (this.tabs.length < 2) {
      const newTab: FileTreeTab = {
        id: this.nextTabId,
        title: `Вкладка ${this.nextTabId}`,
      };
      this.tabs.push(newTab);
      this.nextTabId++; // увеличиваем счетчик для следующей вкладки
    }
  }

  // Метод удаления вкладки по id.
  removeTab(id: number): void {
    this.tabs = this.tabs.filter((tab) => tab.id !== id);
  }
}
