import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectInfo } from '../interfaces/project-info.model';

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
}
