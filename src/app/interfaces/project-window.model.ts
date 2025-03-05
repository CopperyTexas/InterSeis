import { ProjectInfo } from './project-info.model';

export interface ProjectWindow {
  id: number;
  projectInfo: ProjectInfo | null;
}
