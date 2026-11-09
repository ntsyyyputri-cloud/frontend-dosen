"use client";

import React from "react";
import { ProfileFormData } from "@/types/profile";

interface SettingsNotifTabProps {
  formData: ProfileFormData;
  onChange: (field: keyof ProfileFormData, val: string | boolean) => void;
  onSave: () => void;
}

export function SettingsNotifTab({
  formData,
  onChange,
  onSave,
}: SettingsNotifTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900">Preferensi Notifikasi & Peringatan</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Atur bagaimana sistem mengirimkan pengingat deadline dan laporan evaluasi OBE.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div>
            <h4 className="font-bold text-xs text-slate-900">Notifikasi Capaian Pembelajaran AI</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Kirimkan pemberitahuan ketika modul AI selesai memproses analitik kurva kelas.
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.notifCapaian}
            onChange={(e) => onChange("notifCapaian", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div>
            <h4 className="font-bold text-xs text-slate-900">Peringatan Batas Waktu Input Nilai</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Kirimkan reminder berkala 7 hari sebelum periode input nilai akhir ditutup oleh BAAK.
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.notifDeadline}
            onChange={(e) => onChange("notifDeadline", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
        >
          Simpan Preferensi
        </button>
      </div>
    </div>
  );
}

