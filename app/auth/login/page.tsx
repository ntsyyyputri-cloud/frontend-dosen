"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/image/logo.png";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function LecturerLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setRedirectToAdmin(false);

    try {
      if (!formData.identifier || !formData.password) {
        setErrorMsg("NIDN/Email Kampus dan password wajib diisi.");
        setIsLoading(false);
        return;
      }

      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const role = res.role || "dosen";
      localStorage.setItem("gradia_token", res.token);
      localStorage.setItem("gradia_role", role);
      localStorage.setItem("gradia_lecturer", JSON.stringify(res.lecturer || res.user));
      document.cookie = `gradia_token=${res.token}; path=/; max-age=604800; SameSite=Lax;`;
      document.cookie = `gradia_role=${role}; path=/; max-age=604800; SameSite=Lax;`;
      router.push("/Dosen/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk ke sistem.");
      if (err.message && err.message.toLowerCase().includes("admin")) {
        setRedirectToAdmin(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        {/* Brand & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden shadow-xs">
            <Image
              src={logoImg}
              alt="Logo Gradia"
              width={56}
              height={56}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gradia</h1>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
            Portal Khusus Dosen
          </span>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Masuk dengan NIDN atau Email Kampus resmi Anda.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium space-y-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{errorMsg}</span>
            </div>
            {redirectToAdmin && (
              <Link
                href="/auth/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                <span>Buka Login Administrator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-xs font-semibold text-slate-700 mb-1.5">
              NIDN atau Email Kampus
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="identifier"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Contoh: 0412088901 atau dosen@univ.ac.id"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <span className="text-[11px] text-slate-400">Lupa sandi? Hubungi Admin</span>
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
                onChange={handleChange}
                placeholder="Masukkan kata sandi Anda"
                className="w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#4F46E5] focus:ring-[#4F46E5] border-slate-300"
              />
              <span className="text-xs text-slate-600">Ingat sesi di perangkat ini</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-indigo-300 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <span>Memverifikasi akun dosen...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk ke Portal Dosen</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switcher to Admin Portal */}
        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">Administrator Kampus?</p>
          <Link
            href="/auth/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>Masuk ke Portal Administrator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-slate-400 text-center">
        © 2024–2025 Gradia Academic Intelligence System
      </p>
    </div>
  );
}
