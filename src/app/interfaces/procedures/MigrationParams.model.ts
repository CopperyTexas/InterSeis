export interface MigrationParams {
  velocityModelFile: File;
  method: 'Kirchhoff' | 'Stolt';
  aperture: number;
  depthLimit: number;
}
