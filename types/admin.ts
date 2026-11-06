export interface AdminStats {
  totalLecturers: number;
  totalStudents: number;
  totalClasses: number;
  totalGradesSubmitted: number;
}

export interface ProdiStat {
  prodi: string;
  count: number;
}

export interface RecentLecturer {
  id: number;
  nidn: string;
  name: string;
  title_prefix?: string;
  title_suffix?: string;
  email: string;
  created_at: string;
}

export interface RecentClass {
  id: number;
  code: string;
  title: string;
  prodi: string;
  semester: number;
  sks: number;
  lecturer_name: string;
  enrolled_count: number;
}

export interface AdminStatsResponse {
  stats: AdminStats;
  prodiDistribution: ProdiStat[];
  recentLecturers: RecentLecturer[];
  recentClasses: RecentClass[];
}

export * from "./lecturer";

