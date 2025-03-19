export interface FftAnalysisParams {
  method: 'FFT' | 'Wavelet';
  frequencyLimit: number;
  windowSize: number;
}
