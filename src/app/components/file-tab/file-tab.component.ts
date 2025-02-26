import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileTreeTab } from '../../interfaces/tab.model';

@Component({
  selector: 'app-file-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tab.component.html',
  styleUrls: ['./file-tab.component.scss'], // исправлено styleUrl на styleUrls
})
export class FileTabComponent {
  @Input() tabs: FileTreeTab[] = [];
  @Output() tabRemove = new EventEmitter<number>();

  removeTab(id: number, event: Event): void {
    event.stopPropagation();
    this.tabRemove.emit(id);
  }
}
