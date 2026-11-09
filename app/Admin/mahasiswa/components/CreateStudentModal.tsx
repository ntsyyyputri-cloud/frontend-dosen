"use client";

import React from "react";
import { UserPlus, X, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { StudentFormData } from "@/types/student";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: StudentFormData;
  setFormData: React.Dispatch<React.SetStateAction<StudentFormData>>;
  actionState: any;
  formDispatch: (payload: FormData) => void;
  isPending: boolean;
  getFieldError: (fieldName: string) => string | undefined;
}

export function CreateStudentModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  actionState,
  formDispatch,
  isPending,
  getFieldError,
}: CreateStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <span>Tambah Data Mahasiswa Baru</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Input data mahasiswa ke master akademik kampus
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form action={formDispatch} className="space-y-4 pt-4">
          {actionState?.serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionState.serverError}</span>
            </div>
          )}

          {/* NIM & Nama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIM Mahasiswa *
              </label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                placeholder="Contoh: 2110511001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                required
              />
              {getFieldError("nim") && (
                <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                  ⚠️ {getFieldError("nim")}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Aditia Pratama"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                required
              />
              {getFieldError("name") && (
                <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                  ⚠️ {getFieldError("name")}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Mahasiswa *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="mahasiswa@student.univ.ac.id"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              required
            />
            {getFieldError("email") && (
              <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                ⚠️ {getFieldError("email")}
              </span>
            )}
          </div>

          {/* Prodi & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Program Studi *
              </label>
              <select
                name="prodi"
                value={formData.prodi}
                onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                <option value="S1 Informatika">S1 Informatika</option>
                <option value="S1 Sistem Informasi">S1 Sistem Informasi</option>
                <option value="S1 Teknologi Informasi">S1 Teknologi Informasi</option>
                <option value="D3 Manajemen Informatika">D3 Manajemen Informatika</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Akademik
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold flex items-center gap-2 shadow-sm"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Mahasiswa</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

