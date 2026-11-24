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
  "S1 Teknik Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "S1 Manajemen Informatika",
];

const PRODI_DISPLAY_MAP: Record<string, string> = {
  "semua prodi": "Semua Prodi",
  "teknik informatika": "S1 Teknik Informatika",
  "s1 teknik informatika": "S1 Teknik Informatika",
  "sistem informasi": "S1 Sistem Informasi",
  "s1 sistem informasi": "S1 Sistem Informasi",
  "teknologi informasi": "S1 Teknologi Informasi",
  "s1 teknologi informasi": "S1 Teknologi Informasi",
  "manajemen informatika": "S1 Manajemen Informatika",
  "s1 manajemen informatika": "S1 Manajemen Informatika",
};

export function normalizeClassProdi(prodi?: string | null): string {
  const trimmed = (prodi || "").trim();
  if (!trimmed) return "";

  const mapped = PRODI_DISPLAY_MAP[trimmed.toLowerCase()];
  if (mapped) return mapped;

  if (/^(s[1-3]|d[1-4])\s+/i.test(trimmed)) {
    return trimmed.replace(/^(s[1-3]|d[1-4])\s+/i, (prefix) => prefix.toUpperCase());
  }

  return `S1 ${trimmed}`;
}

export function isSameClassProdi(prodiA?: string | null, prodiB?: string | null): boolean {
  const norm = (val?: string | null) => {
    const n = normalizeClassProdi(val).toLowerCase();
    if (n === "s1 informatika" || n === "informatika") return "s1 teknik informatika";
    if (n === "d3 manajemen informatika") return "s1 manajemen informatika";
    return n;
  };
  const a = norm(prodiA);
  const b = norm(prodiB);
  return Boolean(a && b && a === b);
}

export const ACADEMIC_YEAR_OPTIONS = [
  "2024/2025 Ganjil",
  "2024/2025 Genap",
  "2025/2026 Ganjil",
  "2025/2026 Genap",
];

