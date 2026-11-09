"use client";

import React, { type FormEvent } from "react";
import { Key } from "lucide-react";

interface ChangePasswordCardProps {
  oldPassword: string;
  setOldPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
}

export function ChangePasswordCard({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isSubmitting,
  onSubmit,
}: ChangePasswordCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <Key className="w-4 h-4 text-indigo-600" />
        <h2 className="font-bold text-sm text-slate-900">Perbarui Kata Sandi</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kata Sandi Saat Ini
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Masukkan kata sandi lama"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kata Sandi Baru
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan Sandi..." : "Simpan Perubahan Sandi"}
        </button>
      </form>
    </div>
  );
}

