"use client";

import React, { type FormEvent } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { CampusClassData, ClassStudentItem } from "@/types/class";

interface ManageClassStudentsModalProps {
  managingClass: CampusClassData | null;
  masterStudents: ClassStudentItem[];
  classStudents: ClassStudentItem[];
  loadingStudents: boolean;
  selectedMasterStudentId: string;
  setSelectedMasterStudentId: (val: string) => void;
  newNim: string;
  setNewNim: (val: string) => void;
  newName: string;
  setNewName: (val: string) => void;
  onEnroll: (e: FormEvent) => void;
  onUnenroll: (studentId: number) => void;
  onClose: () => void;
}

export function ManageClassStudentsModal({
  managingClass,
  masterStudents,
  classStudents,
  loadingStudents,
  selectedMasterStudentId,
  setSelectedMasterStudentId,
  newNim,
  setNewNim,
  newName,
  setNewName,
  onEnroll,
  onUnenroll,
  onClose,
}: ManageClassStudentsModalProps) {
  if (!managingClass) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Kelola Mahasiswa Kelas: {managingClass.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Kode: <strong className="text-indigo-600">{managingClass.code}</strong> • Dosen: {managingClass.lecturerFullName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Tambah Mahasiswa ke Kelas */}
        <form onSubmit={onEnroll} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">Daftarkan Mahasiswa ke Kelas Ini</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Pilih dari Master Mahasiswa</label>
              <select
                value={selectedMasterStudentId}
                onChange={(e) => {
                  setSelectedMasterStudentId(e.target.value);
                  if (e.target.value) {
                    setNewNim("");
                    setNewName("");
                  }
                }}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="">Pilih Mahasiswa Terdaftar...</option>
                {masterStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nim} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Atau Input NIM Baru</label>
                <input
                  type="text"
                  placeholder="NIM"
                  value={newNim}
                  onChange={(e) => {
                    setNewNim(e.target.value);
                    setSelectedMasterStudentId("");
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setSelectedMasterStudentId("");
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftarkan Mahasiswa</span>
            </button>
          </div>
        </form>

        {/* List Mahasiswa Terdaftar */}
        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-3">NIM</th>
                <th className="py-2.5 px-3">Nama Mahasiswa</th>
                <th className="py-2.5 px-3">Prodi</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingStudents ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Memuat mahasiswa...
                  </td>
                </tr>
              ) : classStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                    Belum ada mahasiswa yang terdaftar di kelas ini.
                  </td>
                </tr>
              ) : (
                classStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{s.nim}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{s.prodi}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onUnenroll(s.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Keluarkan dari kelas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs">
          <span>Total: {classStudents.length} Mahasiswa Terdaftar</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

