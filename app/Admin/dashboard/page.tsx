"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiFetch } from "@/lib/api";
import {
  GraduationCap,
  Users,
  Layers,
  FileCheck2,
  ArrowRight,
  UserPlus,
  BookOpen,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Building,
} from "lucide-react";

interface AdminStats {
  totalLecturers: number;
  totalStudents: number;
  totalClasses: number;
  totalGradesSubmitted: number;
}

interface ProdiStat {
  prodi: string;
  count: number;
}

interface RecentLecturer {
  id: number;
  nidn: string;
  name: string;
  title_prefix?: string;
  title_suffix?: string;
  email: string;
  created_at: string;
}

interface RecentClass {
  id: number;
  code: string;
  title: string;
  prodi: string;
  semester: number;
  sks: number;
  lecturer_name: string;
  enrolled_count: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalLecturers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalGradesSubmitted: 0,
  });
  const [prodiDistribution, setProdiDistribution] = useState<ProdiStat[]>([]);
  const [recentLecturers, setRecentLecturers] = useState<RecentLecturer[]>([]);
  const [recentClasses, setRecentClasses] = useState<RecentClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/admin/stats");
      if (res.stats) setStats(res.stats);
      if (res.prodiDistribution) setProdiDistribution(res.prodiDistribution);
      if (res.recentLecturers) setRecentLecturers(res.recentLecturers);
      if (res.recentClasses) setRecentClasses(res.recentClasses);
    } catch (err: any) {
      console.warn("Gagal mengambil data statistik admin:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      <AdminSidebar currentPath="/Admin/dashboard" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Dashboard Administrator"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pusat Kendali Akademik Terpadu</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Selamat Datang di Portal Administrator Gradia
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Kelola master data dosen, mahasiswa, serta pantau kelengkapan nilai perkuliahan di seluruh program studi secara efisien dan real-time.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 relative z-10">
              <Link
                href="/Admin/dosen"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all text-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Kelola Akun Dosen</span>
              </Link>
              <Link
                href="/Admin/mahasiswa"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/10 transition-all text-xs"
              >
                <Users className="w-4 h-4" />
                <span>Master Data Mahasiswa</span>
              </Link>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Total Dosen */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  TOTAL DOSEN AKTIF
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {isLoading ? "..." : stats.totalLecturers}
                  </span>
                  <span className="text-xs text-indigo-600 font-semibold">Pengajar</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Terdaftar resmi di sistem</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2: Total Mahasiswa */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  TOTAL MAHASISWA
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {isLoading ? "..." : stats.totalStudents}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">Mahasiswa</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Lintas seluruh program studi</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 3: Total Kelas */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  KELAS PERKULIAHAN
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {isLoading ? "..." : stats.totalClasses}
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">Rombel</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Semester 2024/2025 Ganjil</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 4: Nilai Terekap */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  NILAI FINAL TEREKAP
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {isLoading ? "..." : stats.totalGradesSubmitted}
                  </span>
                  <span className="text-xs text-blue-600 font-semibold">Entri</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Sudah terhitung nilai akhir</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Two-Column Section: Distribution & Recent Data */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Program Study Distribution */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Sebaran Mahasiswa per Prodi
                  </h2>
                  <p className="text-slate-400 text-[11px]">Distribusi kuota akademik kampus</p>
                </div>
                <Building className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 pt-2">
                {prodiDistribution.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-6">
                    Belum ada data distribusi program studi.
                  </p>
                ) : (
                  prodiDistribution.map((item, idx) => {
                    const total = stats.totalStudents || 1;
                    const percent = Math.round((item.count / total) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700">{item.prodi}</span>
                          <span className="text-slate-500 font-bold">
                            {item.count} Mhs <span className="text-slate-400 font-normal">({percent}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx % 3 === 0
                                ? "bg-indigo-600"
                                : idx % 3 === 1
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.max(percent, 8)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Recent Classes Overview */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Kelas Perkuliahan Terbaru
                  </h2>
                  <p className="text-slate-400 text-[11px]">5 kelas terakhir yang dibuat oleh para dosen</p>
                </div>
                <Link
                  href="/Admin/kelas"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="pb-3">Kode & Mata Kuliah</th>
                      <th className="pb-3">Dosen Pengampu</th>
                      <th className="pb-3">Prodi</th>
                      <th className="pb-3 text-right">Mahasiswa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentClasses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                          Belum ada data kelas perkuliahan.
                        </td>
                      </tr>
                    ) : (
                      recentClasses.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 pr-2">
                            <span className="font-bold text-slate-800 block text-xs">{c.title}</span>
                            <span className="text-[10px] text-indigo-600 font-semibold">{c.code} • {c.sks} SKS</span>
                          </td>
                          <td className="py-3 px-2 text-slate-700 font-medium text-xs">
                            {c.lecturer_name}
                          </td>
                          <td className="py-3 px-2 text-slate-500 text-xs">{c.prodi}</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                              {c.enrolled_count} Mhs
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Lecturers Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Dosen Baru Terdaftar
                </h2>
                <p className="text-slate-400 text-[11px]">Akun dosen yang baru-baru ini dibuat</p>
              </div>
              <Link
                href="/Admin/dosen"
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1"
              >
                <span>Kelola Dosen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentLecturers.length === 0 ? (
                <p className="text-slate-400 italic text-center py-4 col-span-full">
                  Belum ada dosen yang terdaftar.
                </p>
              ) : (
                recentLecturers.map((lec) => {
                  const fullName = `${lec.title_prefix ? lec.title_prefix + " " : ""}${lec.name}${lec.title_suffix ? ", " + lec.title_suffix : ""}`.trim();
                  return (
                    <div
                      key={lec.id}
                      className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {lec.name[0] || "D"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-xs truncate">{fullName}</p>
                        <p className="text-[10px] text-slate-400 truncate">NIDN: {lec.nidn} • {lec.email}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
