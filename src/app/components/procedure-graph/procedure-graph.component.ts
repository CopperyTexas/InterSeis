import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { JsonPipe, NgForOf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { Procedure } from '../../interfaces/procedure.model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-procedure-graph',
  standalone: true,
  imports: [CdkDropList, NgForOf, CdkDrag, JsonPipe, MatButton],
  templateUrl: './procedure-graph.component.html',
  styleUrl: './procedure-graph.component.scss',
})
export class ProcedureGraphComponent implements OnInit, OnDestroy {
  procedures: Procedure[] = [];
  private subscription!: Subscription;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Инициализируем локальный массив процедур из глобального состояния проекта,
    // если это необходимо. Если каждый проект (окно) передаёт свои данные, лучше получать их через @Input.
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        if (projectInfo && projectInfo.graph) {
          this.procedures = [...projectInfo.graph];
        } else {
          this.procedures = [];
        }
      },
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  drop(event: CdkDragDrop<Procedure[]>): void {
    moveItemInArray(this.procedures, event.previousIndex, event.currentIndex);
    // Здесь можно сохранить новый порядок в глобальное состояние при сохранении проекта
    // Например, вызвать: this.projectService.updateProjectGraph(this.procedures);
  }

  addProcedure(): void {
    // Пример добавления процедуры (можно заменить на вызов диалога для ввода параметров)
    const newProcedure: {
      name: string;
      parameters: { param1: number; param2: number };
    } = {
      name: 'Новая процедура',
      parameters: { param1: 0, param2: 0 },
    };
    // @ts-ignore
    this.procedures.push(newProcedure);
  }
}
