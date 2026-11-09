import React from "react";
import AuthGuard from "@/components/shared/AuthGuard";

export const metadata = {
  title: "Gradia - Portal Evaluasi Dosen",
  description: "Portal Akademik & Evaluasi Penilaian Mahasiswa Berbasis Outcome-Based Education (OBE)",
};

export default function DosenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="dosen">
      {children}
    </AuthGuard>
  );
}

