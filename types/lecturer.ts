export interface LecturerData {
  id: number;
  nidn: string;
  name: string;
  fullName: string;
  email: string;
  title_prefix?: string;
  title_suffix?: string;
  phone?: string;
  office_room?: string;
  consult_hours?: string;
  total_classes: number;
  created_at?: string;
}

export interface LecturerFormData {
  nidn: string;
  name: string;
  titlePrefix: string;
  titleSuffix: string;
  email: string;
  password: string;
  phone: string;
  officeRoom: string;
  consultHours: string;
}

