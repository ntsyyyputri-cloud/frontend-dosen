import { apiFetch } from "@/lib/api";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AdminLoginPayload {
  identifier: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  nidn?: string;
  username?: string;
}

export interface AuthLecturer {
  id: number;
  nidn: string;
  email: string;
  name: string;
  titlePrefix?: string;
  titleSuffix?: string;
  fullName?: string;
  phone?: string;
  officeRoom?: string;
  consultHours?: string;
}

export interface AuthAdmin {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  role: string;
  user: AuthUser;
  lecturer?: AuthLecturer;
  admin?: AuthAdmin;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async adminLogin(payload: AdminLoginPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gradia_token");
      localStorage.removeItem("gradia_role");
      localStorage.removeItem("gradia_admin");
      localStorage.removeItem("gradia_lecturer");
      document.cookie = "gradia_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "gradia_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  },
};

