import { apiFetch } from "@/lib/api";

export interface AdminStats {
  totalLecturers: number;
  totalStudents: number;
  totalClasses: number;
  totalGradesSubmitted: number;
}

export interface ProdiDistribution {
  prodi: string;
  count: number;
}

export interface RecentLecturer {
  id: number;
  nidn: string;
  name: string;
  title_prefix: string;
  title_suffix: string;
  email: string;
  created_at: string;
}

export interface RecentClass {
  id: number;
  code: string;
  title: string;
  prodi: string;
  semester: number;
  sks: number;
  lecturer_name: string;
  enrolled_count: number;
}

export interface AdminStatsResponse {
  stats: AdminStats;
  prodiDistribution: ProdiDistribution[];
  recentLecturers: RecentLecturer[];
  recentClasses: RecentClass[];
}

export interface AdminLecturer {
  id: number;
  nidn: string;
  email: string;
  name: string;
  title_prefix: string;
  title_suffix: string;
  fullName: string;
  phone: string;
  office_room: string;
  consult_hours: string;
  created_at: string;
  total_classes: number;
}

export interface LecturersResponse {
  lecturers: AdminLecturer[];
}

export interface CreateLecturerPayload {
  nidn: string;
  email: string;
  password?: string;
  name: string;
  titlePrefix?: string;
  titleSuffix?: string;
  phone?: string;
  officeRoom?: string;
  consultHours?: string;
}

export interface ResetPasswordResponse {
  message: string;
  newPassword?: string;
}

export interface ImpersonateResponse {
  message: string;
  token: string;
  role: string;
  user: any;
  lecturer: any;
}

export interface AdminStudent {
  id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
  enrolled_classes_count?: number;
}

export interface StudentsResponse {
  students: AdminStudent[];
}

export interface CreateStudentPayload {
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status?: string;
}

export interface AdminCampusClass {
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
  created_at?: string;
  lecturer_id: number;
  lecturer_name: string;
  lecturer_nidn: string;
  title_prefix?: string;
  title_suffix?: string;
  lecturerFullName: string;
  enrolled_count: number;
}

export interface AdminClassesResponse {
  classes: AdminCampusClass[];
}

export interface CreateClassPayload {
  code: string;
  title: string;
  sks: number;
  prodi: string;
  semester: number;
  academic_year?: string;
  capacity?: number;
  schedule?: string;
  room?: string;
  lecturer_id: number | string;
}

export interface ClassStudentItem {
  id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
  enrollment_id?: number;
  tugas?: number | null;
  uts?: number | null;
  uas?: number | null;
  final_score?: number | null;
  letter_grade?: string | null;
  grade_status?: string | null;
}

export interface ClassStudentsResponse {
  class: any;
  students: ClassStudentItem[];
}

export interface EnrollStudentPayload {
  nim?: string;
  name?: string;
  email?: string;
  prodi?: string;
  studentId?: number;
}

export interface GenericMessageResponse {
  message: string;
  [key: string]: any;
}

export const adminService = {
  // Stats
  async getStats(): Promise<AdminStatsResponse> {
    return apiFetch<AdminStatsResponse>("/admin/stats");
  },

  // Lecturers
  async getLecturers(): Promise<LecturersResponse> {
    return apiFetch<LecturersResponse>("/admin/lecturers");
  },

  async createLecturer(payload: CreateLecturerPayload): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>("/admin/lecturers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async deleteLecturer(id: number): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>(`/admin/lecturers/${id}`, {
      method: "DELETE",
    });
  },

  async resetLecturerPassword(id: number, password?: string): Promise<ResetPasswordResponse> {
    return apiFetch<ResetPasswordResponse>(`/admin/lecturers/${id}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    });
  },

  async impersonateLecturer(id: number): Promise<ImpersonateResponse> {
    return apiFetch<ImpersonateResponse>(`/admin/lecturers/${id}/impersonate`, {
      method: "POST",
    });
  },

  // Students
  async getStudents(): Promise<StudentsResponse> {
    return apiFetch<StudentsResponse>("/admin/students");
  },

  async createStudent(payload: CreateStudentPayload): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>("/admin/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async deleteStudent(id: number): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>(`/admin/students/${id}`, {
      method: "DELETE",
    });
  },

  // Classes
  async getClasses(): Promise<AdminClassesResponse> {
    return apiFetch<AdminClassesResponse>("/admin/classes");
  },

  async createClass(payload: CreateClassPayload): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>("/admin/classes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateClass(id: number, payload: Partial<CreateClassPayload>): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>(`/admin/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteClass(id: number): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>(`/admin/classes/${id}`, {
      method: "DELETE",
    });
  },

  // Class Students
  async getClassStudents(classId: number): Promise<ClassStudentsResponse> {
    return apiFetch<ClassStudentsResponse>(`/admin/classes/${classId}/students`);
  },

  async enrollStudent(classId: number, payload: EnrollStudentPayload): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>(`/admin/classes/${classId}/students`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async unenrollStudent(classId: number, studentId: number): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>(`/admin/classes/${classId}/students/${studentId}`, {
      method: "DELETE",
    });
  },
};

