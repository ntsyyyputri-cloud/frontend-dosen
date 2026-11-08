"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  // State untuk memilih mode login: Dosen atau Admin
  const [roleMode, setRoleMode] = useState<"dosen" | "admin">("dosen");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    try {
      if (!formData.identifier.trim() || !formData.password) {
        setErrorMsg(
          roleMode === "admin"
            ? "Username / Email Administrator dan kata sandi wajib diisi."
            : "NIDN / Email Kampus dan kata sandi wajib diisi."
        );
        setIsLoading(false);
        return;
      }

      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password,
        }),
      });

      const detectedRole = (res.role || "dosen").toLowerCase();

      // Validasi kesesuaian role dengan tombol tab yang dipilih
      if (roleMode === "admin" && detectedRole !== "admin") {
        setErrorMsg("Akun ini terdaftar sebagai Dosen. Silakan tekan tombol 'Dosen' di atas untuk masuk.");
        setIsLoading(false);
        return;
      }

      if (roleMode === "dosen" && detectedRole !== "dosen") {
        setErrorMsg("Akun ini terdaftar sebagai Administrator. Silakan tekan tombol 'Admin' di atas untuk masuk.");
        setIsLoading(false);
        return;
      }

      // Simpan autentikasi
      localStorage.setItem("gradia_token", res.token);
      localStorage.setItem("gradia_role", detectedRole);

      document.cookie = `gradia_token=${res.token}; path=/; max-age=604800; SameSite=Lax;`;
      document.cookie = `gradia_role=${detectedRole}; path=/; max-age=604800; SameSite=Lax;`;

      if (detectedRole === "admin") {
        localStorage.setItem("gradia_admin", JSON.stringify(res.admin || res.user));
        localStorage.removeItem("gradia_lecturer");
        router.push("/Admin/dashboard");
      } else {
        localStorage.setItem("gradia_lecturer", JSON.stringify(res.lecturer || res.user));
        localStorage.removeItem("gradia_admin");
        router.push("/Dosen/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      setErrorMsg(
        message ||
          (roleMode === "admin"
            ? "Gagal masuk sebagai Administrator. Periksa username dan kata sandi."
            : "Gagal masuk sebagai Dosen. Periksa NIDN/email dan kata sandi.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        {/* Brand & Header */}
        <div className="text-center mb-6">
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
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
            {roleMode === "admin"
              ? "Pusat Kendali & Administrasi Akademik Kampus"
              : "Portal Evaluasi & Penilaian Akademik Dosen"}
          </p>
        </div>

        {/* Tab Switcher Button Dosen & Admin */}
        <div className="flex p-1 mb-6 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setRoleMode("dosen");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              roleMode === "dosen"
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Dosen</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleMode("admin");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              roleMode === "admin"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onClick={() => setShowPassword((prev) => !prev)}
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
                onChange={handleChange}
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

        {/* Footer info */}
        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            {roleMode === "admin"
              ? "Akses terbatas khusus Administrator resmi Bagian Akademik."
              : "Gunakan akun resmi kampus yang telah diterbitkan oleh Administrator."}
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-slate-400 text-center">
        © 2024–2025 Gradia Academic Intelligence System
      </p>
    </div>
  );
}
