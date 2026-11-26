"use client";

import React from "react";

export function DashboardHeaderBanner() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard Dosen
          </h2>
          <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
            2024/2025 Ganjil Aktif
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Monitoring rekapitulasi capaian akademik & kompilasi evaluasi mahasiswa berbasis
          Outcome-Based Education (OBE).
        </p>
      </div>
    </div>
  );
}

