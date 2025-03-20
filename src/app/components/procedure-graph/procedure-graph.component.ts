import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { JsonPipe, NgForOf } from '@angular/common';
import { Procedure } from '../../interfaces/procedures/procedure.model';
import { ProjectInfo } from '../../interfaces/project-info.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-procedure-graph',
  standalone: true,
  imports: [CdkDropList, NgForOf, CdkDrag, JsonPipe],
  templateUrl: './procedure-graph.component.html',
  styleUrl: './procedure-graph.component.scss',
})
export class ProcedureGraphComponent implements OnChanges {
  // Получаем данные проекта через Input (конкретного окна)
  @Input() projectInfo!: ProjectInfo | null;
  procedures: Procedure<any>[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectInfo']) {
      if (this.projectInfo) {
        // Если поле graph отсутствует, инициализируем его пустым массивом
        if (!this.projectInfo.graph) {
          this.projectInfo.graph = [];
        }
        this.procedures = [...this.projectInfo.graph];
      } else {
        this.procedures = [];
      }
    }
  }

  drop(event: CdkDragDrop<Procedure<any>[]>): void {
    if (event.previousContainer !== event.container) {
      const copiedProcedure: Procedure<any> = {
        ...event.previousContainer.data[event.previousIndex],
        id: uuidv4(), // важно создавать новый уникальный id!
      };

      // копируем элемент в procedures графа
      this.procedures.splice(event.currentIndex, 0, copiedProcedure);
    } else {
      moveItemInArray(this.procedures, event.previousIndex, event.currentIndex);
    }

    this.syncGraph();
  }

  private syncGraph(): void {
    if (this.projectInfo) {
      this.projectInfo.graph = [...this.procedures];
      console.log('Граф процедур обновлён:', this.projectInfo.graph);
    }
  }
}
