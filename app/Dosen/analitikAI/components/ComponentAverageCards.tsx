"use client";

import React from "react";
import { AnalyticsStats } from "@/types/analytics";

interface ComponentAverageCardsProps {
  stats: AnalyticsStats;
}

export function ComponentAverageCards({ stats }: ComponentAverageCardsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <h3 className="font-bold text-slate-900 text-sm">
        Rata-rata Capaian per Komponen Evaluasi
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500">Tugas Mandiri (25%)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.avgTugas}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500">Ujian Tengah Semester (35%)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.avgUts}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500">Ujian Akhir Semester (40%)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.avgUas}</p>
        </div>
      </div>
    </div>
  );
}

