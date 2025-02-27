import { Component, OnInit } from '@angular/core';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { CommonModule } from '@angular/common';
import { FileTreeTab } from '../../interfaces/tab.model';
import { combineLatest, map, Observable } from 'rxjs';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-file-tree-container',
  imports: [FileTreeComponent, CommonModule],
  templateUrl: './file-tree-container.component.html',
  styleUrl: './file-tree-container.component.scss',
})
export class FileTreeContainerComponent implements OnInit {
  // Массив вкладок. Каждый объект имеет уникальный id.
  tabs$!: Observable<FileTreeTab[]>;
  activeTabId$!: Observable<number | null>;
  tabsWithActive$!: Observable<{
    tabs: FileTreeTab[];
    activeId: number | null;
  }>;
  constructor(private tabService: TabService) {}
  ngOnInit(): void {
    this.tabs$ = this.tabService.tabs$;
    this.activeTabId$ = this.tabService.activeTabId$;

    this.tabsWithActive$ = combineLatest([this.tabs$, this.activeTabId$]).pipe(
      map(([tabs, activeId]) => ({ tabs, activeId })),
    );

    // Добавляем первую вкладку по умолчанию, если нужно
    this.tabService.addTab();
  }

  addTab(): void {
    this.tabService.addTab();
  }

  protected readonly length = length;
}
