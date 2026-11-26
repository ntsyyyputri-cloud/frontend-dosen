"use client";

import React from "react";
import { BookOpen, Sliders, AlertTriangle } from "lucide-react";

interface GradeClassHeaderProps {
  classes: any[];
  activeClassId: number | null;
  onClassChange: (classId: number) => void;
  onOpenWeightSettings?: () => void;
  isWeightValid?: boolean;
  totalWeight?: number;
}

export function GradeClassHeader({
  classes,
  activeClassId,
  onClassChange,
  onOpenWeightSettings,
  isWeightValid = true,
  totalWeight = 100,
}: GradeClassHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Input Rekap Nilai Mahasiswa
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Penginputan rekapitulasi nilai berkala, penyesuaian bobot fleksibel, dan kalkulasi otomatis capaian pembelajaran.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
        {/* Class selector */}
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <select
            value={activeClassId || ""}
            onChange={(e) => onClassChange(Number(e.target.value))}
            className="pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none cursor-pointer transition-all max-w-[240px] sm:max-w-xs truncate"
          >
            {classes.length === 0 ? (
              <option value="">Memuat kelas...</option>
            ) : (
              classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code || "KLS"} - {c.title || c.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Atur Bobot Nilai */}
        <button
          type="button"
          onClick={onOpenWeightSettings}
          className={`relative flex items-center gap-1.5 px-3.5 py-2 font-semibold rounded-xl transition-all shadow-2xs text-xs border whitespace-nowrap shrink-0 ${
            isWeightValid
              ? "bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200"
              : "bg-rose-50 hover:bg-rose-100/80 text-rose-700 border-rose-200 animate-pulse"
          }`}
        >
          <Sliders className={`w-3.5 h-3.5 ${isWeightValid ? "text-slate-500" : "text-rose-500"}`} />
          <span>Atur Bobot</span>
          {!isWeightValid && (
            <span className="flex items-center gap-0.5 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5">
              <AlertTriangle className="w-2.5 h-2.5" />
              {totalWeight}%
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
