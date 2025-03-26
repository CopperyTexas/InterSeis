import { Component, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Procedure } from '../../interfaces/procedures/procedure.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-procedure-card',
  imports: [CdkDrag, NgClass],
  templateUrl: './procedure-card.component.html',
  styleUrl: './procedure-card.component.scss',
})
export class ProcedureCardComponent {
  @Input() procedure!: Procedure<any>;
  getGroupBgColor(groupType: Procedure['groupType']): string {
    switch (groupType) {
      case 'single-channel':
        return 'bg-blue-100';
      case 'multi-channel':
        return 'bg-green-100';
      case 'header-processing':
        return 'bg-yellow-100';
      default:
        return 'bg-white';
    }
  }
}
