"use client";

import React from "react";
import { Layers, RefreshCw, Users, Edit, Trash2, Plus } from "lucide-react";
import { CampusClassData } from "@/types/class";

interface ClassTableProps {
  classes: CampusClassData[];
  isLoading: boolean;
  onOpenCreateModal: () => void;
  onOpenManageStudents: (c: CampusClassData) => void;
  onOpenEditModal: (c: CampusClassData) => void;
  onOpenDeleteConfirm: (id: number) => void;
}

export function ClassTable({
  classes,
  isLoading,
  onOpenCreateModal,
  onOpenManageStudents,
  onOpenEditModal,
  onOpenDeleteConfirm,
}: ClassTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Kode & Mata Kuliah</th>
              <th className="py-3 px-4">Dosen Pengampu</th>
              <th className="py-3 px-4">Program Studi</th>
              <th className="py-3 px-4">Jadwal & Ruang</th>
              <th className="py-3 px-4 text-center">Kapasitas</th>
              <th className="py-3 px-4 text-center">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>Memuat data kelas...</span>
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Tidak ada kelas perkuliahan ditemukan.</p>
                  <p className="text-slate-400 text-xs mt-0.5">Silakan sesuaikan filter pencarian atau buat kelas baru.</p>
                  <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Kelas Baru</span>
                  </button>
                </td>
              </tr>
            ) : (
              classes.map((c) => {
                const capacity = c.capacity || 40;
                const enrolled = c.enrolled_count || 0;
                const percent = Math.min(Math.round((enrolled / capacity) * 100), 100);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Kode & Mata Kuliah */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                            {c.code}
                          </span>
                          <span className="text-slate-500 font-semibold">{c.sks} SKS</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">Sem. {c.semester}</span>
                        </div>
                      </div>
                    </td>

                    {/* Dosen Pengampu */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{c.lecturerFullName}</p>
                        <p className="text-[10px] text-slate-400">NIDN: {c.lecturer_nidn}</p>
                      </div>
                    </td>

                    {/* Program Studi */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 text-xs">{c.prodi}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.academic_year || "2024/2025 Ganjil"}</p>
                    </td>

                    {/* Jadwal & Ruangan */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs">
                        <p className="text-slate-700 font-medium">{c.schedule || "Belum diatur"}</p>
                        <p className="text-[10px] text-slate-400">{c.room || "Ruang Kuliah"}</p>
                      </div>
                    </td>

                    {/* Kapasitas */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="max-w-[120px] mx-auto space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold">
                          <span className="text-indigo-600 font-bold">{enrolled} Mhs</span>
                          <span className="text-slate-400">Kuota {capacity}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Aksi Manajemen */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenManageStudents(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition flex items-center gap-1"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Mahasiswa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenEditModal(c)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                          title="Edit Kelas"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenDeleteConfirm(c.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

