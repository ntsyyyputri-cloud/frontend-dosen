"use client";

import React from "react";

export function FacultyAnnouncementCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Pengumuman Fakultas</h3>
        <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
          Penting
        </span>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 text-xs leading-snug">
          Sosialisasi Penjaminan Mutu Akademik & Evaluasi OBE
        </h4>
        <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
          Diharapkan seluruh dosen pengampu menghadiri agenda pembekalan kurikulum
          digital dan peningkatan akreditasi internasional pada hari Jumat mendatang.
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500">
          Auditorium Utama & Zoom
        </span>
        <button
          type="button"
          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-semibold rounded-md hover:bg-indigo-100 transition-all text-xs border border-indigo-200 shrink-0"
        >
          Daftar Agenda
        </button>
      </div>
    </div>
  );
}

