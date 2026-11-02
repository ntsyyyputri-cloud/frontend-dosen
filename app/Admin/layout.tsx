import React from "react";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: "Gradia - Portal Administrator",
  description: "Dashboard Administrator Sistem Informasi Akademik Terintegrasi",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      {children}
    </AuthGuard>
  );
}
