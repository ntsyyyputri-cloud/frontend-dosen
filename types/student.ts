export interface StudentData {
  id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
  enrolled_classes_count: number;
}

export interface StudentFormData {
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
}

export const PRODI_OPTIONS = [
  "Semua Prodi",
  "Teknik Informatika",
  "Sistem Informasi",
  "Teknologi Informasi",
  "Manajemen Informatika",
];

