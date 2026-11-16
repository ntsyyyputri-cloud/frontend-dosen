"use client";

import React from "react";
import Link from "next/link";
import { Save, Upload, MessageSquare } from "lucide-react";

interface GradeClassHeaderProps {
  classes: any[];
  activeClassId: number | null;
  onClassChange: (classId: number) => void;
  onSave: () => void;
  isSaving: boolean;
  appealsCount?: number;
  onOpenAppeals?: () => void;
}

export function GradeClassHeader({
  classes,
  activeClassId,
  onClassChange,
  onSave,
  isSaving,
  appealsCount = 0,
  onOpenAppeals,
}: GradeClassHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Input Rekap Nilai Mahasiswa
          </h2>
          <span className="bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
            OBE Compliant
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Penginputan rekapitulasi penilaian berkala, evaluasi formatif/sumatif, dan kalkulasi otomatis.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Class selector */}
        <select
          value={activeClassId || ""}
          onChange={(e) => onClassChange(Number(e.target.value))}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-600 outline-none"
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

        <button
          type="button"
          onClick={onOpenAppeals}
          className="relative flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-xl transition-all shadow-2xs text-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
          <span>Koreksi Mahasiswa</span>
          {appealsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 animate-pulse">
              {appealsCount}
            </span>
          )}
        </button>

        <Link
          href="/dosen/importnilai"
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-2xs text-xs"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Import Excel</span>
        </Link>

        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-xs text-xs disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Menyimpan..." : "Simpan Rekap"}</span>
        </button>
      </div>
    </div>
  );
}

