"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "dosen";
}

interface DecodedToken {
  id?: number;
  role?: string;
  exp?: number;
  email?: string;
  username?: string;
  nidn?: string;
}

/**
 * Decode dan validasi integritas struktur JWT Token
 */
function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded: DecodedToken = JSON.parse(jsonPayload);

    // Cek waktu kedaluwarsa JWT (exp dalam satuan detik)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null; // Token kedaluwarsa
    }

    return decoded;
  } catch {
    return null; // Token cacat/manipulasi
  }
}

/**
 * Bersihkan seluruh sesi dan cookie jika token tidak valid
 */
function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("gradia_token");
    localStorage.removeItem("gradia_role");
    localStorage.removeItem("gradia_admin");
    localStorage.removeItem("gradia_lecturer");
    document.cookie = "gradia_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "gradia_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("gradia_token");

    // 1. Jika tidak ada token JWT, tendang langsung ke /auth/login
    if (!token) {
      clearAuthSession();
      router.replace("/auth/login");
      return;
    }

    // 2. Validasi & Dekripsi Payload JWT Asli
    const decoded = decodeJwt(token);
    if (!decoded) {
      // Token tidak valid atau sudah kedaluwarsa
      clearAuthSession();
      router.replace("/auth/login");
      return;
    }

    // 3. Baca role asli yang ditandatangani oleh backend (bukan sekadar dari localStorage)
    const rawRole = (decoded.role || "").toLowerCase();
    const isAdmin = rawRole === "admin" || rawRole === "superadmin";
    const isDosen = rawRole === "dosen";

    // Pastikan nilai role di cookie & localStorage sinkron dengan isi JWT
    const cleanRole = isAdmin ? "admin" : isDosen ? "dosen" : "unknown";
    localStorage.setItem("gradia_role", cleanRole);
    if (typeof document !== "undefined") {
      document.cookie = `gradia_token=${token}; path=/; max-age=604800; SameSite=Lax;`;
      document.cookie = `gradia_role=${cleanRole}; path=/; max-age=604800; SameSite=Lax;`;
    }

    // 4. Aturan Akses Role Ketat:
    // Portal Admin hanya boleh diakses oleh Administrator
    if (requiredRole === "admin" && !isAdmin) {
      startTransition(() => {
        router.replace(isDosen ? "/dosen/dashboard" : "/auth/login");
      });
      return;
    }

    // Portal Dosen hanya boleh diakses oleh Dosen (Admin dilarang masuk ke dashboard dosen)
    if (requiredRole === "dosen" && !isDosen) {
      startTransition(() => {
        router.replace(isAdmin ? "/admin/dashboard" : "/auth/login");
      });
      return;
    }

    // 5. Verifikasi Asinkron ke Backend Server
    // Memastikan token belum dicabut/dihapus di database
    const verifyEndpoint = isAdmin ? "/admin/profile" : "/lecturer/profile";
    apiFetch(verifyEndpoint)
      .then(() => {
        setIsAuthorized(true);
      })
      .catch((err) => {
        console.warn("Verifikasi token gagal di server:", err.message);
        clearAuthSession();
        router.replace("/auth/login");
      });
  }, [router, requiredRole]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-slate-600 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Memeriksa hak akses & validasi token JWT...</p>
      </div>
    );
  }

  return <>{children}</>;
}
