import { Component, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Procedure } from '../../interfaces/procedures/procedure.model';

@Component({
  selector: 'app-procedure-card',
  imports: [CdkDrag],
  templateUrl: './procedure-card.component.html',
  styleUrl: './procedure-card.component.scss',
})
export class ProcedureCardComponent {
  @Input() procedure!: Procedure<any>;
}
