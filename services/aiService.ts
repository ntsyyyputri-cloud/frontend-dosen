import { apiFetch } from "@/lib/api";

export interface AIAnalysisPayload {
  classId?: number;
  className?: string;
  totalStudents: number;
  avgScore: number;
  passRate: number;
  remedialCount: number;
}

export interface AIAnalysisResponse {
  strength: string;
  improvement: string;
  recommendation: string;
  source: string;
}

export const aiService = {
  async generateAnalysis(payload: AIAnalysisPayload): Promise<AIAnalysisResponse> {
    return apiFetch<AIAnalysisResponse>("/ai/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  generateLocalFeedback(name: string, finalScore: number, tugas: number, uts: number, uas: number): string {
    if (finalScore >= 85) {
      return `Penguasaan materi oleh ${name} sangat istimewa pada seluruh komponen (Tugas ${tugas}, UTS ${uts}, UAS ${uas}). Memenuhi seluruh indikator capaian pembelajaran OBE secara sangat memuaskan.`;
    } else if (finalScore >= 75) {
      return `Pemahaman konsep dan pengerjaan tugas oleh ${name} baik (Nilai Akhir ${finalScore}). Disarankan untuk memperdalam studi kasus mandiri pada materi evaluasi akhir agar performa lebih optimal.`;
    } else if (finalScore >= 65) {
      return `Capaian kompetensi dasar terpenuhi cukup baik. Namun mahasiswa perlu meningkatkan ketelitian pada pengerjaan ujian dan praktikum evaluasi.`;
    } else {
      return `Mahasiswa direkomendasikan mengikuti sesi bimbingan remedial dan penguatan modul dasar untuk mengejar ketertinggalan capaian pembelajaran mata kuliah.`;
    }
  },
};

