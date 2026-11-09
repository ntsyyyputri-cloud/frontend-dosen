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
  "S1 Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "D3 Manajemen Informatika",
];

