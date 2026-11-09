"use client";

import React, { type FormEvent } from "react";
import { X, RefreshCw, Plus } from "lucide-react";
import {
  CampusClassData,
  ClassFormData,
  LecturerOption,
  CLASS_PRODI_OPTIONS,
  ACADEMIC_YEAR_OPTIONS,
} from "@/types/class";

interface CreateEditClassModalProps {
  isOpen: boolean;
  editingClass: CampusClassData | null;
  formData: ClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormData>>;
  lecturers: LecturerOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function CreateEditClassModal({
  isOpen,
  editingClass,
  formData,
  setFormData,
  lecturers,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateEditClassModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {editingClass ? "Edit Data Kelas" : "Tambah Kelas Perkuliahan Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Kelas *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: TIF-201"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bobot SKS
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={formData.sks}
                onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Mata Kuliah *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Algoritma & Pemrograman"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dosen Pengampu Kelas *
            </label>
            <select
              required
              value={formData.lecturer_id}
              onChange={(e) => setFormData({ ...formData, lecturer_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
            >
              <option value="">Pilih Dosen Pengampu...</option>
              {lecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.fullName || lec.name} (NIDN: {lec.nidn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Program Studi
              </label>
              <select
                value={formData.prodi}
                onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                {CLASS_PRODI_OPTIONS.filter((p) => p !== "Semua Prodi").map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jadwal Pertemuan
              </label>
              <input
                type="text"
                placeholder="Senin, 08:00 - 10:30 WIB"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ruangan
              </label>
              <input
                type="text"
                placeholder="Lab Komputer 1"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahun Akademik
              </label>
              <select
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                {ACADEMIC_YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kapasitas Maksimal Mahasiswa
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingClass ? "Simpan Perubahan" : "Buat Kelas"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

