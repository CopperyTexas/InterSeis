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

@Component({
  selector: 'app-procedure-graph',
  standalone: true,
  imports: [CdkDropList, NgForOf, CdkDrag, JsonPipe],
  templateUrl: './procedure-graph.component.html',
  styleUrl: './procedure-graph.component.scss',
})
export class ProcedureGraphComponent implements OnInit, OnDestroy {
  procedures: Procedure[] = [];
  private subscription!: Subscription;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.subscription = this.projectService.projectInfo$.subscribe(
      (projectInfo) => {
        // Предполагается, что projectInfo.graph имеет тип Procedure[]
        if (projectInfo && projectInfo.graph) {
          this.procedures = projectInfo.graph;
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

  drop(event: CdkDragDrop<never[]>) {
    moveItemInArray(this.procedures, event.previousIndex, event.currentIndex);
  }
}
