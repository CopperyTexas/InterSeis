import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { JsonPipe, NgForOf } from '@angular/common';
import { Procedure } from '../../interfaces/procedure.model';
import { MatButton } from '@angular/material/button';
import { ProjectInfo } from '../../interfaces/project-info.model';

@Component({
  selector: 'app-procedure-graph',
  standalone: true,
  imports: [CdkDropList, NgForOf, CdkDrag, JsonPipe, MatButton],
  templateUrl: './procedure-graph.component.html',
  styleUrl: './procedure-graph.component.scss',
})
export class ProcedureGraphComponent implements OnChanges {
  // Получаем данные проекта через Input (конкретного окна)
  @Input() projectInfo!: ProjectInfo | null;
  procedures: Procedure[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectInfo']) {
      if (this.projectInfo) {
        this.procedures = this.projectInfo.graph
          ? [...this.projectInfo.graph]
          : [];
      } else {
        this.procedures = [];
      }
    }
  }

  drop(event: CdkDragDrop<Procedure[]>): void {
    moveItemInArray(this.procedures, event.previousIndex, event.currentIndex);
    this.syncGraph();
  }

  addProcedure(): void {
    // Генерируем случайное имя, например, "Procedure" с числовым суффиксом
    const randomName = 'Procedure ' + Math.floor(Math.random() * 1000);
    // Генерируем случайные значения для параметров (например, от 0 до 99)
    const randomParam1 = Math.floor(Math.random() * 100);
    const randomParam2 = Math.floor(Math.random() * 100);

    const newProcedure: Procedure = {
      name: randomName,
      parameters: { param1: randomParam1, param2: randomParam2 },
    };

    this.procedures.push(newProcedure);
    this.syncGraph();
    console.log('Процедура добавлена', newProcedure, this.projectInfo?.graph);
  }

  private syncGraph(): void {
    if (this.projectInfo) {
      // Обновляем поле graph в projectInfo,
      // создавая новую копию массива, чтобы изменения точно отразились
      this.projectInfo.graph = [...this.procedures];
    }
  }
}
