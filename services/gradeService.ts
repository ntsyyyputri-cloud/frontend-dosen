import { apiFetch } from "@/lib/api";

export interface GradeItemPayload {
  enrollment_id: number;
  tugas: number | null;
  uts: number | null;
  uas: number | null;
  final_score?: number | null;
  letter_grade?: string | null;
  ai_feedback?: string;
  status?: string;
}

export const gradeService = {
  async getGradesByClass(classId: number) {
    return apiFetch<{ grades: any[] }>(`/grades/${classId}`);
  },

  async saveGrades(classId: number, grades: GradeItemPayload[]) {
    return apiFetch<{ message: string }>(`/grades/${classId}`, {
      method: "POST",
      body: JSON.stringify({ grades }),
    });
  },

  async lockGrades(classId: number) {
    return apiFetch<{ message: string }>(`/grades/${classId}/lock`, {
      method: "PUT",
    });
  },
};

