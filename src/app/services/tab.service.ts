import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileTreeTab } from '../interfaces/tab.model';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private nextTabId = 1;
  private tabSubject = new BehaviorSubject<FileTreeTab[]>([]);
  tabs$ = this.tabSubject.asObservable();
  private activeTabIdSubject = new BehaviorSubject<number | null>(null);
  activeTabId$ = this.activeTabIdSubject.asObservable();

  addTab(): void {
    const currentTab = this.tabSubject.value;
    if (currentTab.length < 2) {
      const newTab: FileTreeTab = {
        id: this.nextTabId,
        title: `Вкладка ${this.nextTabId}`,
      };
      const updateTab = [...currentTab, newTab];
      this.tabSubject.next(updateTab);
      this.activeTabIdSubject.next(newTab.id);
      this.nextTabId++;
    }
  }
  removeTab(id: number): void {
    const updateTab = this.tabSubject.value.filter((tab) => tab.id !== id);
    this.tabSubject.next(updateTab);
    const currentActive = this.activeTabIdSubject.value;
    if (currentActive === id) {
      this.activeTabIdSubject.next(updateTab.length ? updateTab[0].id : null);
    }
  }
  selectTab(id: number): void {
    this.activeTabIdSubject.next(id);
  }
}
