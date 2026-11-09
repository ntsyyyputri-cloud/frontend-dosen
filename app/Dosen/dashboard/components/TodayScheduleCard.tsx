"use client";

import React from "react";
import Link from "next/link";
import { TeachingClass } from "@/types/dashboard";

interface TodayScheduleCardProps {
  classes: TeachingClass[];
}

export function TodayScheduleCard({ classes }: TodayScheduleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Jadwal Mengajar Hari Ini</h3>
          <p className="text-[10px] text-slate-400">
            Sinkronisasi langsung dengan Sistem Akademik Kampus
          </p>
        </div>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
          Kamis, 24 Okt 2024
        </span>
      </div>

      <div className="space-y-3">
        {classes.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-xs font-medium">Belum ada kelas yang ditugaskan kepada Anda.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Silakan hubungi Administrator Kampus untuk alokasi penugasan kelas perkuliahan.
            </p>
          </div>
        ) : (
          classes.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex items-center justify-between gap-4 hover:border-slate-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-2 text-center min-w-[70px] shadow-2xs">
                  <p className="font-bold text-indigo-600 text-xs">{c.code}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{c.sks} SKS</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-xs">{c.title}</h4>
                    <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[9px] border border-emerald-100">
                      Aktif
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>{c.room || "Ruang Teori"}</span>
                    <span>•</span>
                    <span>{c.enrolled_count || 0} Mahasiswa Terdaftar</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/dosen/inputnilai?classId=${c.id}`}
                className="px-3.5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-2xs text-xs shrink-0"
              >
                Input Nilai
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

