import { apiFetch } from "@/lib/api";
import { LecturerDashboardResponse, TeachingClass } from "@/types/dashboard";

export interface ClassesResponse {
  classes: TeachingClass[];
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface LecturerProfileData {
  gelarDepan?: string;
  namaLengkap?: string;
  gelarBelakang?: string;
  nidn?: string;
  emailResmi?: string;
  nomorHp?: string;
  ruangKerja?: string;
  jamKonsultasi?: string;
  notifCapaian?: boolean;
  notifDeadline?: boolean;
}

export const lecturerService = {
  // Dashboard
  async getDashboard(): Promise<LecturerDashboardResponse> {
    return apiFetch<LecturerDashboardResponse>("/dashboard");
  },

  // Classes
  async getClasses(): Promise<ClassesResponse> {
    return apiFetch<ClassesResponse>("/classes");
  },

  // Security / Password
  async updatePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return apiFetch<{ message: string }>("/lecturer/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Profile
  async updateProfile(data: LecturerProfileData): Promise<{ message: string }> {
    return apiFetch<{ message: string }>("/lecturer/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

