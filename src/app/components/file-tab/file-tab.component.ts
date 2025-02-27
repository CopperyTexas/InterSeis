import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileTreeTab } from '../../interfaces/tab.model';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-file-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tab.component.html',
  styleUrls: ['./file-tab.component.scss'],
})
export class FileTabComponent {
  @Input() tab!: FileTreeTab;

  constructor(private tabService: TabService) {}

  removeTab(event: Event): void {
    event.stopPropagation();
    this.tabService.removeTab(this.tab.id);
  }
}
