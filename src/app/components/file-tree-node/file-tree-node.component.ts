import { Component, Input } from '@angular/core';
import { FileNode } from '../../interfaces/file-node';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';

/*
  Компонент FileTreeNodeComponent отвечает за отображение одного узла дерева (файл или папка).
  Он принимает входной параметр node, содержащий информацию об узле, и предоставляет функционал
  для раскрытия/сворачивания узла, а также загрузки его дочерних элементов (если узел является папкой).
*/

@Component({
  selector: 'app-file-tree-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree-node.component.html',
  styleUrls: ['./file-tree-node.component.scss'],
})
export class FileTreeNodeComponent {
  // Декоратор @Input позволяет передать объект FileNode в компонент из родительского компонента.
  @Input() node!: FileNode;

  // Инжектируем FileService для работы с файловой системой через Electron API.
  constructor(private fileService: FileService) {}

  // Метод toggleNode вызывается при клике по узлу и отвечает за переключение состояния открытия узла.
  async toggleNode(event: MouseEvent) {
    // Останавливаем всплытие события, чтобы клик по дочернему узлу не вызывал обработчик родительского элемента.
    event.stopPropagation();

    // Инвертируем состояние узла: если он был закрыт, открываем; если открыт — закрываем.
    this.node.isOpen = !this.node.isOpen;

    // Если узел открыт и его дочерние элементы еще не загружены, загружаем их.
    if (this.node.isOpen && !this.node.children) {
      try {
        // Вызываем метод getFolderContents сервиса FileService для получения содержимого папки по пути node.path.
        // Результат сохраняем в свойство children объекта node.
        this.node.children = await this.fileService.getFolderContents(
          this.node.path,
        );
      } catch (error) {
        // Если происходит ошибка при загрузке, выводим сообщение об ошибке в консоль.
        console.error('Ошибка при загрузке содержимого папки:', error);
      }
    } else if (!this.node.isOpen) {
      // Если узел закрывается, рекурсивно сворачиваем все его дочерние узлы.
      this.collapseChildren(this.node);
    }
  }

  // Метод collapseChildren рекурсивно проходит по всем дочерним узлам и устанавливает для папок isOpen в false.
  private collapseChildren(node: FileNode): void {
    if (node.children) {
      for (const child of node.children) {
        // Если дочерний узел является папкой и открыт, закрываем его.
        if (child.type === 'folder' && child.isOpen) {
          child.isOpen = false;
          // Рекурсивно сворачиваем дочерние узлы внутри текущей папки.
          this.collapseChildren(child);
        }
      }
    }
  }
}
