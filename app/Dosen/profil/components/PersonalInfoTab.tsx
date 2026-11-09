"use client";

import React from "react";
import { Save, RefreshCw } from "lucide-react";
import { ProfileFormData } from "@/types/profile";

interface PersonalInfoTabProps {
  formData: ProfileFormData;
  onChange: (field: keyof ProfileFormData, val: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function PersonalInfoTab({
  formData,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: PersonalInfoTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900">Biodata & Kredensial Resmi Dosen</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Perubahan pada NIDN atau email resmi terikat dengan sinkronisasi PDDikti.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gelar Depan
            </label>
            <input
              type="text"
              value={formData.gelarDepan}
              onChange={(e) => onChange("gelarDepan", e.target.value)}
              placeholder="Contoh: Dr. Ir."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap (Tanpa Gelar) *
            </label>
            <input
              type="text"
              value={formData.namaLengkap}
              onChange={(e) => onChange("namaLengkap", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gelar Belakang
            </label>
            <input
              type="text"
              value={formData.gelarBelakang}
              onChange={(e) => onChange("gelarBelakang", e.target.value)}
              placeholder="Contoh: M.Kom., Ph.D."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              NIDN (Nomor Induk Dosen Nasional)
            </label>
            <input
              type="text"
              value={formData.nidn}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold cursor-not-allowed outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Untuk pembaruan NIDN, silakan hubungi BAAK / Administrator Kampus.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Resmi Kampus
            </label>
            <input
              type="email"
              value={formData.emailResmi}
              onChange={(e) => onChange("emailResmi", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Handphone / WhatsApp
            </label>
            <input
              type="text"
              value={formData.nomorHp}
              onChange={(e) => onChange("nomorHp", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ruang Kerja / Kantor
            </label>
            <input
              type="text"
              value={formData.ruangKerja}
              onChange={(e) => onChange("ruangKerja", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jam Konsultasi Akademik
            </label>
            <input
              type="text"
              value={formData.jamKonsultasi}
              onChange={(e) => onChange("jamKonsultasi", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition"
        >
          Batalkan
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

