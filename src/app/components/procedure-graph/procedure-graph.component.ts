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
import { FftAnalysisParams } from '../../interfaces/procedures/FftAnalysisParams.model';
import { FilteringParams } from '../../interfaces/procedures/FilteringParams.model';
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

  addRandomProcedure(): void {
    const procedureTypes = ['fft-analysis', 'filtering'];
    const randomType =
      procedureTypes[Math.floor(Math.random() * procedureTypes.length)];

    let newProcedure: Procedure<any>;

    switch (randomType) {
      case 'fft-analysis':
        newProcedure = {
          id: uuidv4(),
          type: 'fft-analysis',
          name: 'Спектральный анализ',
          parameters: {
            method: Math.random() > 0.5 ? 'FFT' : 'Wavelet',
            frequencyLimit: Math.floor(Math.random() * 200) + 50,
          } as FftAnalysisParams,
        };
        break;

      case 'filtering':
        newProcedure = {
          id: uuidv4(),
          type: 'filtering',
          name: 'Фильтрация сигнала',
          parameters: {
            filterType: Math.random() > 0.5 ? 'lowpass' : 'highpass',
            cutoffFrequency: Math.floor(Math.random() * 100) + 10,
            order: Math.floor(Math.random() * 4) + 1,
          } as FilteringParams,
        };
        break;

      default:
        throw new Error('Неизвестный тип процедуры!');
    }

    this.procedures.push(newProcedure);
    this.syncGraph();
  }

  private syncGraph(): void {
    if (this.projectInfo) {
      this.projectInfo.graph = [...this.procedures];
      console.log('Граф процедур обновлён:', this.projectInfo.graph);
    }
  }
}
