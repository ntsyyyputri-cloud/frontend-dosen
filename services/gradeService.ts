import { apiFetch } from "@/lib/api";
import { WeightConfig } from "@/types/grade";

export interface GradeItemPayload {
  enrollment_id?: number;
  id?: number;
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
    return apiFetch<{ grades: any[]; weights?: WeightConfig }>(`/grades/${classId}`);
  },

  async saveGrades(classId: number, grades: GradeItemPayload[], weights?: WeightConfig) {
    return apiFetch<{ message: string; weights?: WeightConfig }>(`/grades/${classId}`, {
      method: "PUT",
      body: JSON.stringify({ grades, weights }),
    });
  },

  async getAppealsByClass(classId: number) {
    return apiFetch<{ appeals: any[] }>(`/grades/${classId}/appeals`);
  },

  async updateAppeal(appealId: number, status: "approved" | "rejected" | "pending", response?: string) {
    return apiFetch<{ message: string; appeal: any }>(`/grades/appeals/${appealId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, lecturer_response: response }),
    });
  },
};
