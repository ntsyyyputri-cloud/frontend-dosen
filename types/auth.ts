export type RoleMode = "dosen" | "admin";

export interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

