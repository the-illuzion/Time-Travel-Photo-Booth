export enum AppMode {
  TIME_TRAVEL = 'TIME_TRAVEL',
  MAGIC_EDITOR = 'MAGIC_EDITOR',
  ANALYZER = 'ANALYZER'
}

export interface HistoricalEra {
  id: string;
  name: string;
  description: string;
  promptSuffix: string;
  thumbnail: string;
}

export interface GeneratedImage {
  data: string; // base64
  mimeType: string;
  timestamp: number;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}
