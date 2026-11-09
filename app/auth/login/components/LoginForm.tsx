"use client";

import React, { type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { RoleMode, LoginFormData } from "@/types/auth";

interface LoginFormProps {
  roleMode: RoleMode;
  formData: LoginFormData;
  showPassword: boolean;
  isLoading: boolean;
  errorMsg: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  roleMode,
  formData,
  showPassword,
  isLoading,
  errorMsg,
  onChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <div>
      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium space-y-2">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="identifier" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {roleMode === "admin" ? "Username atau Email Administrator" : "NIDN atau Email Kampus"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {roleMode === "admin" ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <input
              id="identifier"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={onChange}
              placeholder={
                roleMode === "admin"
                  ? "Contoh: admin atau admin@univ.ac.id"
                  : "Contoh: 0412088901 atau dosen@univ.ac.id"
              }
              className={`w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                roleMode === "admin"
                  ? "focus:ring-2 focus:ring-slate-900"
                  : "focus:ring-2 focus:ring-[#4F46E5]"
              }`}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
              Kata Sandi
            </label>
            <span className="text-[11px] text-slate-400">
              {roleMode === "admin" ? "Sistem Resmi Kampus" : "Lupa sandi? Hubungi Admin"}
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Masukkan kata sandi Anda"
              className={`w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                roleMode === "admin"
                  ? "focus:ring-2 focus:ring-slate-900"
                  : "focus:ring-2 focus:ring-[#4F46E5]"
              }`}
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={onChange}
              className={`w-4 h-4 rounded border-slate-300 ${
                roleMode === "admin"
                  ? "text-slate-900 focus:ring-slate-900"
                  : "text-[#4F46E5] focus:ring-[#4F46E5]"
              }`}
            />
            <span className="text-xs text-slate-600">Ingat sesi di perangkat ini</span>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60 ${
              roleMode === "admin"
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-[#4F46E5] hover:bg-[#4338CA]"
            }`}
          >
            {isLoading ? (
              <span>Memverifikasi akun {roleMode === "admin" ? "admin" : "dosen"}...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>
                  Masuk sebagai {roleMode === "admin" ? "Administrator" : "Dosen"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

