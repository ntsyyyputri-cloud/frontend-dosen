"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "dosen";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("gradia_token") : null;
    const role = (typeof window !== "undefined" ? localStorage.getItem("gradia_role") : null) || "dosen";

    if (!token) {
      if (requiredRole === "admin") {
        router.replace("/auth/admin");
      } else {
        router.replace("/auth/login");
      }
      return;
    }

    // Sinkronisasi cookie untuk Server Actions Next.js
    if (typeof document !== "undefined") {
      if (!document.cookie.includes("gradia_token=")) {
        document.cookie = `gradia_token=${token}; path=/; max-age=604800; SameSite=Lax;`;
      }
      if (!document.cookie.includes("gradia_role=")) {
        document.cookie = `gradia_role=${role}; path=/; max-age=604800; SameSite=Lax;`;
      }
    }

    // Proteksi berbasis role
    // Portal Admin hanya boleh dimasuki oleh role admin
    if (requiredRole === "admin" && role !== "admin") {
      router.replace("/auth/admin");
      return;
    }

    // Portal Dosen boleh dimasuki oleh role dosen dan role admin
    if (requiredRole === "dosen" && role !== "dosen" && role !== "admin") {
      router.replace("/auth/login");
      return;
    }

    setIsAuthorized(true);
  }, [router, requiredRole]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-slate-600 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500">Memeriksa hak akses dan sesi...</p>
      </div>
    );
  }

  return <>{children}</>;
}

