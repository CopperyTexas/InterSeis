import { Component } from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { ProcedureCardComponent } from '../procedure-card/procedure-card.component';
import { NgForOf } from '@angular/common';
import { Procedure } from '../../interfaces/procedures/procedure.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-procedure-list',
  imports: [CdkDropList, ProcedureCardComponent, NgForOf],
  templateUrl: './procedure-list.component.html',
  styleUrl: './procedure-list.component.scss',
})
export class ProcedureListComponent {
  procedures: Procedure<any>[] = [
    {
      id: uuidv4(),
      type: 'fft-analysis',
      name: 'Спектральный анализ',
      parameters: { method: 'FFT', frequencyLimit: 150 },
    },
    {
      id: uuidv4(),
      type: 'filtering',
      name: 'Фильтрация сигнала',
      parameters: { filterType: 'lowpass', cutoffFrequency: 50, order: 2 },
    },
  ];
}
