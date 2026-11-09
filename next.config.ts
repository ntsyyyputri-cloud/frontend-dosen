import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/auth/admin",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/Dosen/:path*", destination: "/dosen/:path*" },
      { source: "/Admin/:path*", destination: "/admin/:path*" },
      { source: "/dashboard", destination: "/dosen/dashboard" },
      { source: "/dashboard/export-laporan", destination: "/dosen/cetakPDF" },
      { source: "/dashboard/input-nilai", destination: "/dosen/inputnilai" },
      { source: "/dashboard/ai-feedback", destination: "/dosen/analitikAI" },
      { source: "/dashboard/profil", destination: "/dosen/profil" },
      { source: "/kelas", destination: "/admin/kelas" },
      { source: "/tambah-kelas", destination: "/admin/kelas" },
      { source: "/input-nilai", destination: "/dosen/inputnilai" },
      { source: "/import-nilai", destination: "/dosen/importnilai" },
      { source: "/import-excel", destination: "/dosen/importnilai" },
      { source: "/analitik-ai", destination: "/dosen/analitikAI" },
      { source: "/generate-ai", destination: "/dosen/generateAI" },
      { source: "/cetak-laporan", destination: "/dosen/cetakPDF" },
      { source: "/export-laporan", destination: "/dosen/cetakPDF" },
      { source: "/kelola-profil", destination: "/dosen/profil" },
      { source: "/keamanan", destination: "/dosen/keamanan" },
      { source: "/panduan", destination: "/dosen/dashboard" },
    ];
  },
};

export default nextConfig;
