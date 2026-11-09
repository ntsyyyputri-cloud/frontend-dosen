"use client";

import React from "react";
import { LecturerDashboardStats } from "@/types/dashboard";

interface DashboardStatsGridProps {
  stats: LecturerDashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-500 font-medium block mb-2">Total Kelas Diampu</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{stats.totalClasses}</span>
          <span className="text-slate-600 font-medium">Kelas Aktif</span>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-indigo-600 font-semibold">
          <span>100% Kapasitas ruang optimal</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-500 font-medium block mb-2">Total Mahasiswa</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{stats.totalStudents}</span>
          <span className="text-slate-600 font-medium">Terdaftar</span>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px]">
          <span className="text-emerald-600 font-semibold">Aktif KRS</span>
          <span className="text-slate-400">• Seluruh Prodi</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-500 font-medium block mb-2">Rekap Tertunda</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-600">{stats.pendingGrading}</span>
          <span className="text-amber-700 font-medium">Kelas Tertunda</span>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-amber-600 font-medium">
          <span>Sisa 6 hari periode pengisian</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-500 font-medium block mb-2">Analitik OBE & AI</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{stats.aiReportsReady}</span>
          <span className="text-slate-600 font-medium">Laporan Siap</span>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-purple-600 font-semibold">
          <span>Akurasi rubrik evaluasi 98.4%</span>
        </div>
      </div>
    </div>
  );
}

