"use client";

import React from "react";
import { Award, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { ProfileFormData } from "@/types/profile";

interface ProfileHeroBannerProps {
  formData: ProfileFormData;
}

export function ProfileHeroBanner({ formData }: ProfileHeroBannerProps) {
  const fullName = `${formData.gelarDepan ? formData.gelarDepan + " " : ""}${formData.namaLengkap}${formData.gelarBelakang ? ", " + formData.gelarBelakang : ""}`.trim();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
          {formData.namaLengkap[0] || "D"}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{fullName}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 self-center sm:self-auto">
              <ShieldCheck className="w-3 h-3" />
              <span>Dosen Tetap Aktif</span>
            </span>
          </div>

          <p className="text-slate-500 text-xs">
            NIDN: <strong className="text-slate-800">{formData.nidn}</strong> • Program Studi S1 Informatika • Fakultas Ilmu Komputer
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{formData.emailResmi}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{formData.nomorHp}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{formData.ruangKerja}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

