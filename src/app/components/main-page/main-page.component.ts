import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main-page', // Указываем селектор компонента
  imports: [], // В Standalone Components можно импортировать модули, но здесь пока пусто
  templateUrl: './main-page.component.html', // Путь к файлу шаблона
  styleUrl: './main-page.component.scss', // Путь к файлу стилей
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
      const newWidth = Math.max(200, Math.min(800, event.clientX)); // Ограничиваем размер от 200px до 800px
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
}
