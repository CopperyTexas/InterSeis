import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectInfo } from '../interfaces/project-info.model';
import { Procedure } from '../interfaces/procedure.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectInfoSubject = new BehaviorSubject<ProjectInfo | null>(null);
  projectInfo$: Observable<ProjectInfo | null> =
    this.projectInfoSubject.asObservable();

  setProjectInfo(info: ProjectInfo): void {
    this.projectInfoSubject.next(info);
  }

  getCurrentProjectInfo(): ProjectInfo | null {
    return this.projectInfoSubject.value;
  }

  // Метод для обновления поля graph в текущем проекте
  updateProjectGraph(newGraph: Procedure[]): void {
    const currentProject = this.getCurrentProjectInfo();
    if (currentProject) {
      const updatedProject: ProjectInfo = {
        ...currentProject,
        graph: newGraph,
      };
      this.setProjectInfo(updatedProject);
    }
  }
}
