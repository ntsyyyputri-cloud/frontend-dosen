export interface LecturerDashboardStats {
  totalClasses: number;
  totalStudents: number;
  pendingGrading: number;
  aiReportsReady: number;
  accuracyRubric: string;
}

export interface TeachingClass {
  id: number;
  code: string;
  title: string;
  sks: number;
  prodi?: string;
  semester?: number;
  room?: string;
  schedule?: string;
  enrolled_count?: number;
}

export interface LecturerDashboardResponse {
  stats: LecturerDashboardStats;
  classes: TeachingClass[];
}

