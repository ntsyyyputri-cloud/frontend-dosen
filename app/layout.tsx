import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gradia - Portal Dosen Penilaian OBE",
  description: "Portal Akademik & Evaluasi Penilaian Mahasiswa Berbasis Outcome-Based Education (OBE)",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" translate="no" className="notranslate" suppressHydrationWarning>
      <body className="antialiased notranslate" translate="no" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
