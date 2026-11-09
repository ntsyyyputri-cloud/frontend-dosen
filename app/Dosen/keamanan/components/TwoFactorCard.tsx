"use client";

import React from "react";
import { Smartphone } from "lucide-react";

interface TwoFactorCardProps {
  twoFactor: boolean;
  onToggle: (val: boolean) => void;
}

export function TwoFactorCard({ twoFactor, onToggle }: TwoFactorCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <Smartphone className="w-4 h-4 text-emerald-600" />
        <h2 className="font-bold text-sm text-slate-900">Otentikasi Dua Langkah (2FA)</h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-800">Aktifkan Verifikasi OTP</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Meningkatkan keamanan akun dengan meminta kode autentikasi setiap kali masuk.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!twoFactor)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            twoFactor ? "bg-emerald-600" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              twoFactor ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

