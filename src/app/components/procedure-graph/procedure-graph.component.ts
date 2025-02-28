import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { JsonPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-procedure-graph',
  standalone: true,
  imports: [CdkDropList, NgForOf, CdkDrag, JsonPipe],
  templateUrl: './procedure-graph.component.html',
  styleUrl: './procedure-graph.component.scss',
})
export class ProcedureGraphComponent {
  procedures = [
    { name: 'Procedure 1', parameters: { param1: 'value1', param2: 123 } },
    { name: 'Procedure 2', parameters: { param1: 'value2', param2: 456 } },
    // Добавляйте процедуры по мере необходимости
  ];

  drop(event: CdkDragDrop<never[]>) {
    moveItemInArray(this.procedures, event.previousIndex, event.currentIndex);
  }
}
