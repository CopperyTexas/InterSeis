import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Procedure } from '../../interfaces/procedures/procedure.model';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-procedure-graph-card',
  imports: [CdkDrag, MatSlideToggle, MatSelect, MatOption, NgClass],
  templateUrl: './procedure-graph-card.component.html',
  styleUrl: './procedure-graph-card.component.scss',
})
export class ProcedureGraphCardComponent {
  @Input() procedure!: Procedure<any>;
  @Input() index!: number;
  @Output() doubleClick = new EventEmitter<void>();
  @Output() activeToggle = new EventEmitter<boolean>();
  @Output() modeChange = new EventEmitter<'SP' | 'DP' | 'OP' | 'None'>();

  onDoubleClick() {
    this.doubleClick.emit();
  }
  onToggleChange(checked: boolean) {
    this.activeToggle.emit(checked);
  }
  onModeChange(value: 'SP' | 'DP' | 'OP' | 'None') {
    this.modeChange.emit(value);
  }
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
