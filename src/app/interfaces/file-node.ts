export interface FileNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FileNode[]; // Только у папок могут быть вложенные элементы
  isOpen?: boolean;
}
