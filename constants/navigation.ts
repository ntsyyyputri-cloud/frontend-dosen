import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Layers,
  PlusCircle,
  FileEdit,
  Sparkles,
  BarChart3,
  Printer,
  User,
  ShieldCheck,
} from "lucide-react";
import { MenuGroup } from "@/types/shared";

export const ADMIN_MENU_GROUPS: MenuGroup[] = [
  {
    group: "RINGKASAN",
    items: [
      {
        label: "Dashboard Utama",
        href: "/Admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "DATA MASTER & AKUN",
    items: [
      {
        label: "Manajemen Dosen",
        href: "/Admin/dosen",
        icon: GraduationCap,
      },
      {
        label: "Master Mahasiswa",
        href: "/Admin/mahasiswa",
        icon: Users,
      },
    ],
  },
  {
    group: "PENGELOLAAN AKADEMIK",
    items: [
      {
        label: "Manajemen Data Kelas",
        href: "/Admin/kelas",
        icon: Layers,
      },
      {
        label: "Tambah Kelas Baru",
        href: "/Admin/tambahkelas",
        icon: PlusCircle,
      },
    ],
  },
];

export const DOSEN_MENU_GROUPS: MenuGroup[] = [
  {
    group: "UTAMA",
    items: [
      {
        label: "Dashboard",
        href: "/Dosen/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "PENILAIAN & EVALUASI",
    items: [
      {
        label: "Input Rekap Nilai",
        href: "/Dosen/inputnilai",
        icon: FileEdit,
      },
      {
        label: "Import Nilai & Generate AI",
        href: "/Dosen/importnilai",
        icon: Sparkles,
      },
    ],
  },
  {
    group: "KECERDASAN BUATAN & LAPORAN",
    items: [
      {
        label: "Analitik & AI Feedback",
        href: "/Dosen/analitikAI",
        icon: BarChart3,
      },
      {
        label: "Cetak PDF & Laporan",
        href: "/Dosen/cetakPDF",
        icon: Printer,
      },
    ],
  },
  {
    group: "PENGATURAN AKUN",
    items: [
      {
        label: "Kelola Profil",
        href: "/Dosen/profil",
        icon: User,
      },
      {
        label: "Keamanan & Akun",
        href: "/Dosen/keamanan",
        icon: ShieldCheck,
      },
    ],
  },
];

