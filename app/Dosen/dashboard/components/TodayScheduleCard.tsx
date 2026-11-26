"use client";

import React, { useState } from "react";
import { CheckCircle2, ClipboardCheck, Users, X } from "lucide-react";
import { TeachingClass } from "@/types/dashboard";

interface TodayScheduleCardProps {
  classes: TeachingClass[];
}

export function TodayScheduleCard({ classes }: TodayScheduleCardProps) {
  const [selectedClass, setSelectedClass] = useState<TeachingClass | null>(null);
  const [pertemuan, setPertemuan] = useState<number>(1);
  const [openSessions, setOpenSessions] = useState<Record<number, number>>({});

  const handleToggleSession = (classId: number) => {
    setOpenSessions((prev) => {
      const next = { ...prev };
      if (next[classId] === pertemuan) {
        delete next[classId];
      } else {
        next[classId] = pertemuan;
      }
      return next;
    });
  };

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
          classes.map((c) => {
            const activePertemuan = openSessions[c.id];
            return (
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
                      {activePertemuan && (
                        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full text-[9px] border border-indigo-100">
                          Presensi P{activePertemuan} Dibuka
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>{c.room || "Ruang Teori"}</span>
                      <span>•</span>
                      <span>{c.enrolled_count || 0} Mahasiswa Terdaftar</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPertemuan(openSessions[c.id] || 1);
                    setSelectedClass(c);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-2xs text-xs shrink-0 cursor-pointer"
                >
                  Buka Presensi
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Presensi Kelas */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sesi Presensi Kelas</h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedClass.code} • {selectedClass.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>{selectedClass.enrolled_count || 0} Mahasiswa Terdaftar</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedClass.room || "Ruang Teori"}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Pilih Pertemuan Perkuliahan
                </label>
                <select
                  value={pertemuan}
                  onChange={(e) => setPertemuan(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {Array.from({ length: 16 }, (_, idx) => idx + 1).map((num) => (
                    <option key={num} value={num}>
                      Pertemuan {num}
                    </option>
                  ))}
                </select>
              </div>

              {openSessions[selectedClass.id] === pertemuan && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold">Presensi Pertemuan {pertemuan} sedang aktif</p>
                    <p className="text-[11px] text-emerald-700">
                      Mahasiswa dapat melakukan check-in kehadiran melalui aplikasi Gradia.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedClass(null)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleSession(selectedClass.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs text-white transition-colors ${
                    openSessions[selectedClass.id] === pertemuan
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {openSessions[selectedClass.id] === pertemuan
                    ? "Tutup Sesi Presensi"
                    : "Aktifkan Sesi Presensi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
