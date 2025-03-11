import { Procedure } from './procedure.model';

export interface ProjectInfo {
  objectName: string;
  profileName: string;
  creationDate: string;
  user: string;
  filePath: string;
  graph: Procedure[];
}
