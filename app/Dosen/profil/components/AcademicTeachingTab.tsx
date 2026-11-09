"use client";

import React from "react";
import { BookOpen, Award, CheckCircle2 } from "lucide-react";

export function AcademicTeachingTab() {
  const teachingClasses = [
    { code: "TIF-201", title: "Rekayasa Perangkat Lunak", sks: 3, semester: 3, prodi: "S1 Informatika", enrolled: 38 },
    { code: "TIF-305", title: "Interaksi Manusia & Komputer", sks: 3, semester: 5, prodi: "S1 Informatika", enrolled: 48 },
    { code: "TIF-102", title: "Algoritma & Pemrograman Dasar", sks: 4, semester: 1, prodi: "S1 Informatika", enrolled: 42 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Penugasan Mengajar & Beban SKS Semester Ini</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Beban Kerja Dosen (BKD) Periode Semester Ganjil 2024/2025
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
          Total: 10 SKS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teachingClasses.map((c) => (
          <div key={c.code} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded">
                {c.code}
              </span>
              <span className="text-xs font-bold text-slate-700">{c.sks} SKS</span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 leading-snug">{c.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{c.prodi} • Sem. {c.semester}</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>{c.enrolled} Mahasiswa</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terverifikasi</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

