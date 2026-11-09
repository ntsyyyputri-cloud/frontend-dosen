"use client";

import React from "react";

interface GradeStatsCardsProps {
  averages: {
    tugas: string;
    uts: string;
    uas: string;
    final: string;
  };
  totalStudents: number;
}

export function GradeStatsCards({ averages, totalStudents }: GradeStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-400 text-[11px] font-semibold block mb-1">Rata-rata Tugas</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{averages.tugas}</span>
          <span className="text-[10px] text-slate-400 font-medium">Bobot 25%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-400 text-[11px] font-semibold block mb-1">Rata-rata UTS</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{averages.uts}</span>
          <span className="text-[10px] text-slate-400 font-medium">Bobot 35%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-400 text-[11px] font-semibold block mb-1">Rata-rata UAS</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{averages.uas}</span>
          <span className="text-[10px] text-slate-400 font-medium">Bobot 40%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <span className="text-slate-400 text-[11px] font-semibold block mb-1">Rata-rata Kelas Akhir</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-indigo-600">{averages.final}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">{totalStudents} Mhs</span>
        </div>
      </div>
    </div>
  );
}

