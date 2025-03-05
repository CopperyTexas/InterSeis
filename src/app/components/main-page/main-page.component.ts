import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FileTreeContainerComponent } from '../file-tree-container/file-tree-container.component';
import { ProcedureGraphComponent } from '../procedure-graph/procedure-graph.component';
import { ProjectInfoComponent } from '../project-info/project-info.component';
import { ProjectWindow } from '../../interfaces/project-window.model';

@Component({
  selector: 'app-main-page',
  imports: [
    FileTreeContainerComponent,
    ProcedureGraphComponent,
    ProjectInfoComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  // Получаем ссылки на DOM-элементы с помощью ViewChild
  @ViewChild('sidebar', { static: false }) sidebar!: ElementRef; // Левая панель
  @ViewChild('procedures', { static: false }) procedures!: ElementRef; // Правая панель

  // Переменная для отслеживания, какую границу пользователь перетаскивает
  private resizing: 'left' | 'right' | null = null;

  constructor(private renderer: Renderer2) {} // Внедряем Renderer2 для изменения стилей элементов

  /**
   * Начинаем процесс изменения размера при нажатии на границу.
   * @param event - Событие мыши
   * @param panel - Какая панель изменяется: 'left' (левая) или 'right' (правая)
   */
  startResizing(event: MouseEvent, panel: 'left' | 'right') {
    this.resizing = panel; // Запоминаем, какую границу перетаскиваем

    // Добавляем обработчики событий для изменения размеров
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.stopResizing);
  }

  /**
   * Изменяет размер левой или правой панели во время движения мыши.
   * @param event - Событие мыши
   */
  resize = (event: MouseEvent) => {
    if (!this.resizing) return; // Если пользователь не перетаскивает границу, выходим из функции

    // Если перетаскивается левая панель (sidebar)
    if (this.resizing === 'left' && this.sidebar?.nativeElement) {
      const newWidth = Math.max(400, Math.min(800, event.clientX)); // Ограничиваем размер от 400px до 800px
      this.renderer.setStyle(
        this.sidebar.nativeElement,
        'width',
        `${newWidth}px`, // Устанавливаем новую ширину
      );
    }

    // Если перетаскивается правая панель (procedures)
    if (this.resizing === 'right' && this.procedures?.nativeElement) {
      const newWidth = Math.max(
        200,
        Math.min(800, window.innerWidth - event.clientX), // Контролируем, чтобы панель не выходила за границы окна
      );
      this.renderer.setStyle(
        this.procedures.nativeElement,
        'width',
        `${newWidth}px`, // Устанавливаем новую ширину
      );
    }
  };

  /**
   * Останавливает изменение размеров при отпускании кнопки мыши.
   */
  stopResizing = () => {
    this.resizing = null; // Сбрасываем состояние

    // Удаляем обработчики событий, чтобы не перегружать DOM
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResizing);
  };
  @Input() projectWindow!: ProjectWindow;
}
