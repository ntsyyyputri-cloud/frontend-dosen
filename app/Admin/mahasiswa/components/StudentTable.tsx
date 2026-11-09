"use client";

import React from "react";
import { RefreshCw, BookOpen, Trash2 } from "lucide-react";
import { StudentData } from "@/types/student";

interface StudentTableProps {
  students: StudentData[];
  isLoading: boolean;
  onOpenDeleteConfirm: (std: StudentData) => void;
}

export function StudentTable({
  students,
  isLoading,
  onOpenDeleteConfirm,
}: StudentTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">NIM & Mahasiswa</th>
              <th className="py-3 px-4">Program Studi</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Kelas Terdaftar</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>Memuat data mahasiswa...</span>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                  Tidak ada data mahasiswa yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              students.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {std.name[0] || "M"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{std.name}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          NIM: {std.nim} • {std.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 text-xs">{std.prodi}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        std.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {std.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>{std.enrolled_classes_count || 0} Mata Kuliah</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDeleteConfirm(std)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      title="Hapus Data Mahasiswa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

