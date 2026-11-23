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
  // Proxy API requests to backend during development
  async rewrites() {
    return [
<<<<<<< HEAD
      { source: "/api/:path*", destination: "http://localhost:5002/api/:path*" },
      // UI route rewrites
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
=======
      { source: "/dosen", destination: "/Dosen/dashboard" },
      { source: "/dosen/:path*", destination: "/Dosen/:path*" },
      { source: "/admin", destination: "/Admin/dashboard" },
      { source: "/admin/:path*", destination: "/Admin/:path*" },
      { source: "/dashboard", destination: "/Dosen/dashboard" },
      { source: "/dashboard/export-laporan", destination: "/Dosen/cetakPDF" },
      { source: "/dashboard/input-nilai", destination: "/Dosen/inputnilai" },
      { source: "/dashboard/ai-feedback", destination: "/Dosen/analitikAI" },
      { source: "/dashboard/profil", destination: "/Dosen/profil" },
      { source: "/kelas", destination: "/Admin/kelas" },
      { source: "/tambah-kelas", destination: "/Admin/kelas" },
      { source: "/input-nilai", destination: "/Dosen/inputnilai" },
      { source: "/import-nilai", destination: "/Dosen/importnilai" },
      { source: "/import-excel", destination: "/Dosen/importnilai" },
      { source: "/analitik-ai", destination: "/Dosen/analitikAI" },
      { source: "/generate-ai", destination: "/Dosen/generateAI" },
      { source: "/cetak-laporan", destination: "/Dosen/cetakPDF" },
      { source: "/export-laporan", destination: "/Dosen/cetakPDF" },
      { source: "/kelola-profil", destination: "/Dosen/profil" },
      { source: "/keamanan", destination: "/Dosen/keamanan" },
      { source: "/panduan", destination: "/Dosen/dashboard" },
>>>>>>> 16003b65b9ccd3443c86550e93f66b80e5d3fcb9
    ];

  },
};

export default nextConfig;
