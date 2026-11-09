import React from "react";
import { UserPlus, X, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { LecturerFormData } from "@/types/lecturer";

interface CreateLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: LecturerFormData;
  setFormData: React.Dispatch<React.SetStateAction<LecturerFormData>>;
  actionState: any;
  formDispatch: (payload: FormData) => void;
  isPending: boolean;
  getFieldError: (fieldName: string) => string | undefined;
}

export function CreateLecturerModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  actionState,
  formDispatch,
  isPending,
  getFieldError,
}: CreateLecturerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <span>Tambah Akun Dosen Baru</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Input data dosen resmi untuk pembuatan akun dan hak akses portal
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
          {/* Pesan Kesalahan Global dari Server Action */}
          {actionState?.serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionState.serverError}</span>
            </div>
          )}

          {/* Baris 1: NIDN & Nama Lengkap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIDN *
              </label>
              <input
                type="text"
                name="nidn"
                value={formData.nidn}
                onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                placeholder="Contoh: 0412088901"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                required
              />
              {getFieldError("nidn") && (
                <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                  ⚠️ {getFieldError("nidn")}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Dosen *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
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

          {/* Baris 2: Gelar Depan & Gelar Belakang */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gelar Depan
              </label>
              <input
                type="text"
                name="titlePrefix"
                value={formData.titlePrefix}
                onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                placeholder="Contoh: Dr. Ir."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gelar Belakang
              </label>
              <input
                type="text"
                name="titleSuffix"
                value={formData.titleSuffix}
                onChange={(e) => setFormData({ ...formData, titleSuffix: e.target.value })}
                placeholder="Contoh: M.Kom."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Baris 3: Email & Password Sementara */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Resmi Dosen *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="dosen@univ.ac.id"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                required
              />
              {getFieldError("email") && (
                <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                  ⚠️ {getFieldError("email")}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi Sementara *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                required
              />
              {getFieldError("password") && (
                <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                  ⚠️ {getFieldError("password")}
                </span>
              )}
            </div>
          </div>

          {/* Baris 4: No. Handphone & Ruang Kantor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp / Kontak
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08123456789"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ruang Kantor / Dosen
              </label>
              <input
                type="text"
                name="officeRoom"
                value={formData.officeRoom}
                onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                placeholder="Gedung B Lt. 3"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
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
                  <span>Menyimpan ke Server...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Dosen Baru</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

