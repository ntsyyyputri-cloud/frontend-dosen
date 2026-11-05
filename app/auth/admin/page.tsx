"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/image/logo.png";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [redirectToDosen, setRedirectToDosen] = useState(false);

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
    setRedirectToDosen(false);

    try {
      if (!formData.identifier || !formData.password) {
        setErrorMsg("Username/Email Administrator dan kata sandi wajib diisi.");
        setIsLoading(false);
        return;
      }

      const res = await apiFetch("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      localStorage.setItem("gradia_token", res.token);
      localStorage.setItem("gradia_role", "admin");
      localStorage.setItem("gradia_admin", JSON.stringify(res.user));
      document.cookie = `gradia_token=${res.token}; path=/; max-age=604800; SameSite=Lax;`;
      document.cookie = `gradia_role=admin; path=/; max-age=604800; SameSite=Lax;`;

      router.push("/Admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk sebagai Administrator.");
      if (err.message && err.message.toLowerCase().includes("dosen")) {
        setRedirectToDosen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
        {/* Brand Header */}
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
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
            Portal Administrator Kampus
          </span>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Pusat kendali dan administrasi akademik terpadu.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium space-y-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{errorMsg}</span>
            </div>
            {redirectToDosen && (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                <span>Buka Login Dosen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username atau Email Administrator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="identifier"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Contoh: admin atau admin@gradia.ac.id"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi Administrator
            </label>
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
                placeholder="Masukkan kata sandi Administrator"
                className="w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
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
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span className="text-xs text-slate-600">Ingat sesi Administrator</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <span>Memverifikasi hak akses admin...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Masuk sebagai Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switcher back to Dosen Login */}
        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">Bukan Administrator?</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
          >
            <span>Masuk ke Portal Dosen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-slate-500 text-center">
        Gradia Academic System • Tingkat Keamanan Tinggi (RBAC)
      </p>
    </div>
  );
}
