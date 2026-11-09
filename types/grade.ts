export type StudentStatus =
  | "Tersimpan"
  | "Perlu remedial"
  | "Belum lengkap";

export type ScoreField = "tugas" | "uts" | "uas";

export interface GradeStudent {
  id: number;
  nim: string;
  name: string;
  type: string;
  avatar: string;
  tugas: number | null;
  uts: number | null;
  uas: number | null;
  aiFeedback: string;
  status: StudentStatus;
}

export interface GradeResult {
  score: string | null;
  grade: string;
}

export type FilterTab = "Semua" | "Lulus" | "Remedial";

export interface WeightConfig {
  tugas: number;
  uts: number;
  uas: number;
}

