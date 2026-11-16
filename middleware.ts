import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar path atau awalan path yang wajib login
const PROTECTED_PREFIXES = [
  "/dosen",
  "/Dosen",
  "/admin",
  "/Admin",
  "/dashboard",
  "/kelas",
  "/input-nilai",
  "/import-nilai",
  "/analitik-ai",
  "/generate-ai",
  "/cetak-laporan",
  "/export-laporan",
  "/kelola-profil",
  "/keamanan",
];

/**
 * Decode payload JWT di Edge runtime tanpa dependensi eksternal
 */
function parseJwtPayload(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah request menuju ke rute yang memerlukan autentikasi
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const token = request.cookies.get("gradia_token")?.value;

    // 1. Frontend: Jika belum login (tidak ada token), wajib diarahkan ke /auth/login
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("gradia_token");
      response.cookies.delete("gradia_role");
      return response;
    }

    // 2. Session: Jika token tidak valid atau sudah kedaluwarsa, wajib login kembali
    const payload = parseJwtPayload(token);
    if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      loginUrl.searchParams.set("expired", "1");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("gradia_token");
      response.cookies.delete("gradia_role");
      return response;
    }

    const role = (payload.role || request.cookies.get("gradia_role")?.value || "").toLowerCase();

    // 3. Role: Hanya akun dengan role dosen yang boleh mengakses Dashboard Dosen
    const isDosenRoute =
      pathname.toLowerCase().startsWith("/dosen") || pathname === "/dashboard";
    const isAdminRoute =
      pathname.toLowerCase().startsWith("/admin") || pathname === "/kelas";

    if (isDosenRoute && role !== "dosen") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized_role");
      loginUrl.searchParams.set("role", "dosen");
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && role !== "admin" && role !== "superadmin") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized_role");
      loginUrl.searchParams.set("role", "admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dosen/:path*",
    "/Dosen/:path*",
    "/admin/:path*",
    "/Admin/:path*",
    "/dashboard/:path*",
    "/dashboard",
    "/kelas/:path*",
    "/kelas",
    "/input-nilai",
    "/import-nilai",
    "/analitik-ai",
    "/generate-ai",
    "/cetak-laporan",
    "/export-laporan",
    "/kelola-profil",
    "/keamanan",
  ],
};
