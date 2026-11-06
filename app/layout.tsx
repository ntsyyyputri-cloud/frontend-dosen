import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gradia - Portal Dosen Penilaian OBE",
  description: "Portal Akademik & Evaluasi Penilaian Mahasiswa Berbasis Outcome-Based Education (OBE)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
