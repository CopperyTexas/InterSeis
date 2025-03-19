export interface FilteringParams {
  filterType: 'lowpass' | 'highpass';
  cutoffFrequency: number;
  order: number;
}
