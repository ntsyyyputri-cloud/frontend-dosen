"use client";

import React from "react";
import Link from "next/link";

export function ObeProgressCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Progress Penginputan Nilai OBE
          </h3>
          <p className="text-[10px] text-slate-400">
            Status rekap CPL (Capaian Pembelajaran Lulusan)
          </p>
        </div>
        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
          Target Final: 30 Nov 2024
        </span>
      </div>

      <div className="space-y-4">
        {/* Progress Item 1 */}
        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">
                Rekayasa Perangkat Lunak - Kls A
              </h4>
              <p className="text-[10px] text-slate-400">
                32 dari 38 Mahasiswa telah dinilai komprehensif
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-indigo-600">85%</span>
              <Link
                href="/dosen/inputnilai"
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-semibold rounded-md hover:bg-indigo-100 transition-all text-[11px]"
              >
                Lanjutkan Rekap
              </Link>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: "85%" }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>Komponen: Tugas (100%), UTS (100%), UAS (60%)</span>
            <span className="text-purple-600 font-semibold">Rekomendasi AI siap</span>
          </div>
        </div>

        {/* Progress Item 2 */}
        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">
                Interaksi Manusia & Komputer - Kls C
              </h4>
              <p className="text-[10px] text-slate-400">
                48 dari 48 Mahasiswa dinilai penuh
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-emerald-600">100%</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200 text-[10px]">
                Terkunci / Selesai
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Arsip dikirim ke BAAK</span>
            <span className="text-slate-600 font-medium">BAP Berita Acara: Terbit</span>
          </div>
        </div>

        {/* Progress Item 3 */}
        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">
                Sistem Basis Data Terdistribusi - Kls B
              </h4>
              <p className="text-[10px] text-slate-400">0 dari 42 Mahasiswa dinilai</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-slate-400">0%</span>
              <Link
                href="/dosen/inputnilai"
                className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all text-[11px]"
              >
                Mulai Input
              </Link>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-slate-300 h-full rounded-full" style={{ width: "0%" }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="text-amber-600 font-medium">Belum ada nilai tugas terunggah</span>
            <Link href="/dosen/importnilai" className="text-blue-600 hover:underline font-medium">
              Gunakan Import Excel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

