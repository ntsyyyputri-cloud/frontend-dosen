export interface CampusClassData {
  id: number;
  code: string;
  title: string;
  sks: number;
  prodi: string;
  semester: number;
  academic_year: string;
  capacity: number;
  schedule: string;
  room: string;
  lecturer_id: number;
  lecturer_name: string;
  lecturer_nidn: string;
  lecturerFullName: string;
  enrolled_count: number;
}

export interface LecturerOption {
  id: number;
  nidn: string;
  name: string;
  fullName: string;
}

export interface ClassStudentItem {
  id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
  enrollment_id?: number;
}

export interface ClassFormData {
  code: string;
  title: string;
  sks: number;
  prodi: string;
  semester: number;
  academic_year: string;
  capacity: number;
  schedule: string;
  room: string;
  lecturer_id: string;
}

export const CLASS_PRODI_OPTIONS = [
  "Semua Prodi",
  "S1 Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "D3 Manajemen Informatika",
];

export const ACADEMIC_YEAR_OPTIONS = [
  "2024/2025 Ganjil",
  "2024/2025 Genap",
  "2025/2026 Ganjil",
  "2025/2026 Genap",
];

