import { apiFetch } from "@/lib/api";
import {
  AttendanceSessionInfo,
  ClassAttendanceDetailResponse,
  CorrectableStatus,
  LecturerScheduleItem,
} from "@/types/attendance";

export const attendanceService = {
  /** GET Jadwal Mengajar Dosen beserta status sesi presensi */
  async getSchedule(): Promise<{ classes: LecturerScheduleItem[] }> {
    return apiFetch<{ classes: LecturerScheduleItem[] }>("/attendances/schedule");
  },

  /** POST Buka/Tutup Sesi Presensi Mobile */
  async toggleSession(
    classId: number,
    pertemuan: number,
    isOpen: boolean
  ): Promise<{ message: string; session: AttendanceSessionInfo }> {
    return apiFetch<{ message: string; session: AttendanceSessionInfo }>("/attendances/sessions", {
      method: "POST",
      body: JSON.stringify({ classId, pertemuan, isOpen }),
    });
  },

  /** GET Daftar Kehadiran Kelas per Pertemuan (sinkron mobile) */
  async getClassAttendance(
    classId: number,
    pertemuan?: number
  ): Promise<ClassAttendanceDetailResponse> {
    const query = pertemuan ? `?pertemuan=${pertemuan}` : "";
    return apiFetch<ClassAttendanceDetailResponse>(`/attendances/class/${classId}${query}`);
  },

  /** PATCH Koreksi Status Kehadiran Mahasiswa + Audit Log Dosen */
  async correctStatus(
    classId: number,
    studentId: number,
    payload: {
      pertemuan: number;
      status: CorrectableStatus;
      alasan_koreksi: string;
    }
  ): Promise<{ message: string; attendance: any }> {
    return apiFetch<{ message: string; attendance: any }>(
      `/attendances/class/${classId}/student/${studentId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },
};

