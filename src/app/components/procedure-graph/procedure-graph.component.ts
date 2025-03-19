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

  private syncGraph(): void {
    if (this.projectInfo) {
      // Обновляем поле graph в projectInfo,
      // создавая новую копию массива, чтобы изменения точно отразились
      this.projectInfo.graph = [...this.procedures];
    }
  }
  getProcedureSummary(procedure: Procedure<any>): string {
    switch (procedure.type) {
      case 'fft-analysis':
        const fftParams = procedure.parameters as FftAnalysisParams;
        return `Метод: ${fftParams.method}, Частота: ${fftParams.frequencyLimit}`;

      case 'filtering':
        const filterParams = procedure.parameters as FilteringParams;
        return `Фильтр: ${filterParams.filterType}, Частота среза: ${filterParams.cutoffFrequency}, Порядок: ${filterParams.order}`;

      default:
        return 'Неизвестная процедура';
    }
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
  }
}
