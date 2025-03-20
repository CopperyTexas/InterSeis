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
    {
      id: uuidv4(),
      type: 'recursive-directional-filter',
      name: 'Рекурсивная остронаправленная фильтрация',
      parameters: {
        method: 'IIR',
        filterOrder: 4,
        cutoffFrequency: 50,
        recursiveIterations: 3,
        direction: 'bidirectional',
        stabilityThreshold: 0.01,
      },
    },
    {
      id: uuidv4(),
      type: 'static-corrections-pp-pv',
      name: 'Статические поправки ПП и ПВ',
      parameters: {
        method: 'time-shift',
        ppCorrection: 15,
        pvCorrection: 10,
        maxAllowedShift: 25,
        minAllowedShift: -25,
        alignmentTolerance: 0.05,
      },
    },
    {
      id: uuidv4(),
      type: 'trace-centering',
      name: 'Центрирование трасс',
      parameters: {
        method: 'mean',
        centerCalculation: 'weighted',
        adjustAmplitude: true,
        referenceLevel: 0,
        tolerance: 0.05,
      },
    },
    {
      id: uuidv4(),
      type: 'automatic-amplitude-adjustment',
      name: 'Автоматическая регулировка амплитуд',
      parameters: {
        method: 'normalization',
        targetAmplitude: 1.0,
        maxGain: 2.0,
        minGain: 0.5,
        smoothingWindow: 10,
        adjustmentThreshold: 0.1,
      },
    },
    {
      id: uuidv4(),
      type: 'zero-phase-bandpass-filter',
      name: 'Нуль-фазовая полосовая фильтрация',
      parameters: {
        method: 'filtfilt',
        lowFrequency: 5,
        highFrequency: 50,
        filterOrder: 4,
        attenuation: 0.01,
        phaseResponse: 'zero',
      },
    },
    {
      id: uuidv4(),
      type: 'minimum-phase-predictive-deconvolution',
      name: 'Минимальная фазовая предсказывающая деконволюция сейсмических трасс',
      parameters: {
        method: 'predictive',
        predictionLag: 5,
        filterLength: 50,
        waterLevel: 0.1,
        stabilizationFactor: 0.001,
        iterations: 1,
      },
    },
    {
      id: uuidv4(),
      type: 'fan-filtering',
      name: 'Веерная фильтрация',
      parameters: {
        method: 'directional',
        fanAngle: 30,
        spread: 15,
        filterOrder: 4,
        attenuation: 0.05,
        stabilizationFactor: 0.001,
      },
    },
    {
      id: uuidv4(),
      type: 'kinematics-io',
      name: 'Ввод / вывод кинематики',
      parameters: {
        inputFormat: 'segy',
        outputFormat: 'resfil',
        coordinateSystem: 'local',
        scaleFactor: 1.0,
        errorThreshold: 0.01,
        interpolationMethod: 'linear',
      },
    },
    {
      id: uuidv4(),
      type: 'linear-filtering',
      name: 'Линейная фильтрация',
      parameters: {
        method: 'convolution',
        filterCoefficients: [0.25, 0.5, 0.25],
        filterOrder: 2,
        smoothingWindow: 5,
        attenuation: 0.02,
        phaseResponse: 'linear',
      },
    },
    {
      id: uuidv4(),
      type: 'wiener-signal-filter',
      name: 'Винеровая фильтрация формы сигнала',
      parameters: {
        method: 'wiener',
        filterLength: 25,
        noiseEstimate: 'auto',
        smoothing: 0.1,
        gainControl: true,
        iterations: 1,
      },
    },
    {
      id: uuidv4(),
      type: 'conversion',
      name: 'Конвертация',
      parameters: {
        inputFormat: 'raw',
        outputFormat: 'resfil',
        dataType: 'I2',
        preserveHeaders: true,
        byteSwap: false,
        normalization: 'none',
        interpolationMethod: 'linear',
      },
    },
    {
      id: uuidv4(),
      type: 'coherent-filtering',
      name: 'Когерентная фильтрация',
      parameters: {
        method: 'correlation',
        windowLength: 30,
        overlap: 50,
        coherenceThreshold: 0.8,
        smoothing: 0.05,
        iterations: 2,
      },
    },
    {
      id: uuidv4(),
      type: 'signal-filtering',
      name: 'Фильтрация сигналов',
      parameters: {
        method: 'butterworth',
        filterType: 'bandpass',
        filterOrder: 4,
        lowFrequency: 5,
        highFrequency: 50,
        phaseResponse: 'linear',
        attenuation: 0.01,
      },
    },
    {
      id: uuidv4(),
      type: 'synchronous-axis-filtering',
      name: 'Фильтрация сигнала по направлению осей синфазности',
      parameters: {
        method: 'phase-coherent',
        axisSelection: 'primary',
        filterOrder: 3,
        coherenceThreshold: 0.8,
        smoothingWindow: 20,
        attenuation: 0.02,
      },
    },
  ];
}
