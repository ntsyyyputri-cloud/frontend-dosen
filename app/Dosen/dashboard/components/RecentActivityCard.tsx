"use client";

import React from "react";

export function RecentActivityCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-sm">Aktivitas Terbaru</h3>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
          4 Log Baru
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-1 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded text-[9px] border border-purple-100">
              AI Generated
            </span>
            <span className="text-[10px] text-slate-400">10m lalu</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Feedback otomatis rubrik Capaian Pembelajaran kelas RPL-A berhasil diterbitkan.
          </p>
        </div>

        <div className="space-y-1 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded text-[9px] border border-blue-100">
              Nilai Disimpan
            </span>
            <span className="text-[10px] text-slate-400">1j lalu</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Draf penilaian Tugas Proyek disinkronisasi ke server pusat.
          </p>
        </div>

        <div className="space-y-1 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[9px] border border-amber-100">
              Portal BAAK
            </span>
            <span className="text-[10px] text-slate-400">3j lalu</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Batas akhir perbaikan revisi komponen nilai semester: 10 Des 2024.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[9px]">
              Cetak PDF
            </span>
            <span className="text-[10px] text-slate-400">Kemarin</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Dokumen Berita Acara Perkuliahan resmi IMK-C berhasil diekspor berformat PDF.
          </p>
        </div>
      </div>
    </div>
  );
}

