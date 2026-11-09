"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, FileText, LayoutDashboard } from "lucide-react";

export function StepFinishLock() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Proses Import & Penguncian Nilai Selesai!
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Seluruh data rekap nilai, rubrik evaluasi, dan feedback AI telah dikunci secara resmi dan disinkronkan ke pangkalan data akademik universitas.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/dosen/cetakPDF"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Cetak Laporan PDF</span>
        </Link>

        <Link
          href="/dosen/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

