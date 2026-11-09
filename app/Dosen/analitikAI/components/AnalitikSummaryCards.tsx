"use client";

import React from "react";
import { AnalyticsStats } from "@/types/analytics";

interface AnalitikSummaryCardsProps {
  stats: AnalyticsStats;
}

export function AnalitikSummaryCards({ stats }: AnalitikSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Rata-rata */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <span className="text-slate-400 font-semibold text-xs block mb-1">Rata-rata Kelas</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{stats.avgScore}</span>
          <span className="text-xs font-semibold text-slate-400">/ 100</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
          Kalkulasi gabungan Tugas, UTS, UAS
        </p>
      </div>

      {/* Tingkat Kelulusan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <span className="text-slate-400 font-semibold text-xs block mb-1">Tingkat Kelulusan</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-600">{stats.passRate}%</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${stats.passRate}%` }}
          />
        </div>
      </div>

      {/* Mahasiswa Lulus */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <span className="text-slate-400 font-semibold text-xs block mb-1">Mahasiswa Lulus</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-indigo-600">{stats.passCount}</span>
          <span className="text-xs font-semibold text-slate-400">/ {stats.total} Mhs</span>
        </div>
        <p className="text-[10px] text-indigo-600 font-semibold mt-2 pt-2 border-t border-slate-100">
          Nilai akhir minimal 65.0 (C+)
        </p>
      </div>

      {/* Perlu Remedial */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <span className="text-slate-400 font-semibold text-xs block mb-1">Perlu Remedial</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-rose-600">{stats.remedialCount}</span>
          <span className="text-xs font-semibold text-slate-400">Mahasiswa</span>
        </div>
        <p className="text-[10px] text-rose-600 font-semibold mt-2 pt-2 border-t border-slate-100">
          Memerlukan pembinaan tambahan
        </p>
      </div>
    </div>
  );
}

