"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Users, Layers, FileCheck2 } from "lucide-react";
import { AdminStats } from "@/types/admin";

export interface AdminStatsGridProps {
  stats: AdminStats;
  isLoading: boolean;
}

export default function AdminStatsGrid({ stats, isLoading }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Dosen */}
      <Link
        href="/admin/dosen"
        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
      >
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-indigo-600 transition-colors">
            TOTAL DOSEN AKTIF
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {isLoading ? "..." : stats.totalLecturers}
            </span>
            <span className="text-xs text-indigo-600 font-semibold">Pengajar</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Kelola data dosen →</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <GraduationCap className="w-6 h-6" />
        </div>
      </Link>

      {/* Stat 2: Total Mahasiswa */}
      <Link
        href="/admin/mahasiswa"
        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
      >
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-emerald-600 transition-colors">
            TOTAL MAHASISWA
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {isLoading ? "..." : stats.totalStudents}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Mahasiswa</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Kelola master mahasiswa →</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Users className="w-6 h-6" />
        </div>
      </Link>

      {/* Stat 3: Total Kelas */}
      <Link
        href="/admin/kelas"
        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-amber-300 hover:shadow-md transition-all group"
      >
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-amber-600 transition-colors">
            KELAS PERKULIAHAN
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {isLoading ? "..." : stats.totalClasses}
            </span>
            <span className="text-xs text-amber-600 font-semibold">Rombel</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Kelola kelas &amp; rombel →</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Layers className="w-6 h-6" />
        </div>
      </Link>

      {/* Stat 4: Nilai Terekap */}
      <Link
        href="/admin/kelas"
        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group"
      >
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors">
            NILAI FINAL TEREKAP
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {isLoading ? "..." : stats.totalGradesSubmitted}
            </span>
            <span className="text-xs text-blue-600 font-semibold">Entri</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Lihat kelas perkuliahan →</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <FileCheck2 className="w-6 h-6" />
        </div>
      </Link>
    </div>
  );
}

