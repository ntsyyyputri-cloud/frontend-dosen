export type AttendanceStatus = "hadir" | "izin" | "sakit" | "alpa" | "belum";

export type CorrectableStatus = "hadir" | "izin" | "sakit" | "alpa";

export interface LecturerScheduleItem {
  id: number;
  code: string;
  title: string;
  sks: number;
  prodi: string;
  semester: number;
  room: string;
  schedule: string;
  enrolled_count: number;
  is_session_open: boolean;
  active_pertemuan: number | null;
  present_count: number;
}

export interface AttendanceSessionInfo {
  pertemuan: number;
  is_open: boolean;
  opened_at: string | null;
  closed_at: string | null;
  date: string;
}

export interface AttendanceStats {
  total: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  belum: number;
}

export interface StudentAttendanceRow {
  student_id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  attendance_id: number | null;
  status: AttendanceStatus;
  notes: string;
  attachment_url: string;
  alasan_koreksi: string;
  audit_dosen: boolean;
  date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ClassAttendanceDetailResponse {
  class: {
    id: number;
    code: string;
    title: string;
    sks: number;
    prodi: string;
    semester: number;
    room: string;
    schedule: string;
    enrolled_count: number;
  };
  session: AttendanceSessionInfo;
  stats: AttendanceStats;
  students: StudentAttendanceRow[];
}

