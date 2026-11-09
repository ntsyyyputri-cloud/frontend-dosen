import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Layers,
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
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "DATA MASTER & AKUN",
    items: [
      {
        label: "Manajemen Dosen",
        href: "/admin/dosen",
        icon: GraduationCap,
      },
      {
        label: "Manajemen Kelas",
        href: "/admin/kelas",
        icon: Layers,
      },
      {
        label: "Master Mahasiswa",
        href: "/admin/mahasiswa",
        icon: Users,
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
        href: "/dosen/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "PENILAIAN & EVALUASI",
    items: [
      {
        label: "Input Rekap Nilai",
        href: "/dosen/inputnilai",
        icon: FileEdit,
      },
      {
        label: "Import Nilai & Generate AI",
        href: "/dosen/importnilai",
        icon: Sparkles,
      },
    ],
  },
  {
    group: "KECERDASAN BUATAN & LAPORAN",
    items: [
      {
        label: "Analitik & AI Feedback",
        href: "/dosen/analitikAI",
        icon: BarChart3,
      },
      {
        label: "Cetak PDF & Laporan",
        href: "/dosen/cetakPDF",
        icon: Printer,
      },
    ],
  },
  {
    group: "PENGATURAN AKUN",
    items: [
      {
        label: "Kelola Profil",
        href: "/dosen/profil",
        icon: User,
      },
      {
        label: "Keamanan & Akun",
        href: "/dosen/keamanan",
        icon: ShieldCheck,
      },
    ],
  },
];
