import { Component, Input } from '@angular/core';
import { ProjectInfo } from '../../interfaces/project-info.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.scss',
  imports: [NgIf],
})
export class ProjectInfoComponent {
  @Input() projectInfo!: ProjectInfo | null;
}
