export type ProfileTab =
  | "Informasi Pribadi & Identitas"
  | "Beban Mengajar & Akademik"
  | "Pengaturan & Notifikasi";

export interface ProfileFormData {
  gelarDepan: string;
  namaLengkap: string;
  gelarBelakang: string;
  nidn: string;
  emailResmi: string;
  nomorHp: string;
  ruangKerja: string;
  jamKonsultasi: string;
  notifCapaian: boolean;
  notifDeadline: boolean;
}

