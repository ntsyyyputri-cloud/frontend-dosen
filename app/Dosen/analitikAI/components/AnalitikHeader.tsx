"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Printer } from "lucide-react";

interface AnalitikHeaderProps {
  classes: any[];
  selectedClassId: number | null;
  onClassChange: (id: number) => void;
  onGenerateAI: () => void;
  generatingAI: boolean;
}

export function AnalitikHeader({
  classes,
  selectedClassId,
  onClassChange,
  onGenerateAI,
  generatingAI,
}: AnalitikHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>Analitik Capaian Pembelajaran & AI Feedback</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Kompilasi otomatis performa mahasiswa berbasis rubrik OBE dengan dukungan evaluasi generatif AI.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <select
          value={selectedClassId || ""}
          onChange={(e) => onClassChange(Number(e.target.value))}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-purple-600 outline-none"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code || "KLS"} - {c.title || c.name}
            </option>
          ))}
        </select>

        <Link
          href="/dosen/cetakPDF"
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-all"
          title="Cetak Laporan PDF"
        >
          <Printer className="w-4 h-4" />
        </Link>

        <button
          type="button"
          disabled={generatingAI}
          onClick={onGenerateAI}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          <span>{generatingAI ? "Menganalisis..." : "Generate AI Insights"}</span>
        </button>
      </div>
    </div>
  );
}

