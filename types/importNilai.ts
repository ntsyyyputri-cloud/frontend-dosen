export interface ImportPreviewRow {
  nim: string;
  name: string;
  tugas: number;
  uts: number;
  uas: number;
  finalScore: number;
  aiFeedback?: string;
  status?: string;
}

export interface UploadedFileInfo {
  name: string;
  size: string;
  rows: number;
  uploadedAt: string;
}

export interface AIClassSummary {
  strength: string;
  improvement: string;
  recommendation: string;
}

