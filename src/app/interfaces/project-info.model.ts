import { Procedure } from './procedures/procedure.model';

export interface ProjectInfo {
  objectName: string;
  profileName: string;
  creationDate: string;
  user: string;
  filePath: string;
  graph: Procedure[];
}
