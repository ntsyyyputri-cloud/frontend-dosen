"use client";

import React from "react";
import { Printer } from "lucide-react";

interface CetakPDFControlBarProps {
  classes: any[];
  selectedClassId: number | null;
  onClassChange: (id: number) => void;
  onPrint: () => void;
}

export function CetakPDFControlBar({
  classes,
  selectedClassId,
  onClassChange,
  onPrint,
}: CetakPDFControlBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <label className="font-semibold text-slate-700">Pilih Kelas / Mata Kuliah:</label>
        <select
          value={selectedClassId || ""}
          onChange={(e) => onClassChange(Number(e.target.value))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {classes.length === 0 ? (
            <option value="">Belum ada kelas aktif</option>
          ) : (
            classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code || "KLS"} - {c.title || c.name} ({c.prodi || "Informatika"})
              </option>
            ))
          )}
        </select>
      </div>

      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
      >
        <Printer className="w-4 h-4" />
        <span>Cetak Dokumen Resmi (PDF)</span>
      </button>
    </div>
  );
}

