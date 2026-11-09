"use client";

import React from "react";
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
  );
}

