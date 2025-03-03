import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../interfaces/project-info.model';
import { Observable } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.scss',
  imports: [AsyncPipe, NgIf],
})
export class ProjectInfoComponent implements OnInit {
  projectInfo$!: Observable<ProjectInfo | null>;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectInfo$ = this.projectService.projectInfo$;
  }
}
