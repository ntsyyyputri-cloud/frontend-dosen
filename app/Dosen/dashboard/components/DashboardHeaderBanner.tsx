"use client";

import React from "react";
import Link from "next/link";
import { Download, FileEdit, Sparkles } from "lucide-react";

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

      <div className="flex items-center gap-2 shrink-0">
        {/* Tombol Export Laporan PDF */}
        <Link
          href="/dosen/cetakPDF"
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Laporan PDF</span>
        </Link>

        {/* Tombol Input Nilai */}
        <Link
          href="/dosen/inputnilai"
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Input Nilai Rekap</span>
        </Link>

        {/* Tombol Import & Generate AI */}
        <Link
          href="/dosen/importnilai"
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Import & Generate AI</span>
        </Link>
      </div>
    </div>
  );
}

