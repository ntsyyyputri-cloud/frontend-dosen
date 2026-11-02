"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/image/logo.png";
import ilutrasiImg from "@/public/image/login.png";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  GraduationCap,
  ShieldAlert,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* BAGIAN KIRI: FORM LOGIN DOSEN */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Header / Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs overflow-hidden">
                <Image
                  src={logoImg}
                  alt="Logo Gradia"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                  Gradia
                </h1>
                <p className="text-xs text-indigo-600 font-semibold">
                  Portal Khusus Dosen
                </p>
              </div>
            </div>

            {/* Judul & Deskripsi */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] mb-2 border border-indigo-200/60">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Area Khusus Pengajar / Dosen</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Selamat Datang, Bapak/Ibu Dosen!
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                Silakan masuk menggunakan NIDN atau Email Kampus resmi Anda untuk mengelola kelas dan nilai mahasiswa.
              </p>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0">⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                  {redirectToAdmin && (
                    <Link
                      href="/auth/admin"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
                    >
                      <span>Buka Halaman Login Administrator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}

              {/* NIDN / Email Kampus Login */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  NIDN atau Email Kampus *
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

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Kata Sandi *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Lupa sandi? Hubungi Admin
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
                    className="w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#4F46E5] focus:ring-[#4F46E5] border-slate-300"
                  />
                  <span className="text-xs text-slate-600">
                    Ingat sesi saya di perangkat ini
                  </span>
                </label>
              </div>

              {/* Action Button */}
              <div className="space-y-3 pt-2">
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

            {/* Switcher to Admin Login */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Administrator Kampus?</p>
                <p className="text-[11px] text-slate-500">Masuk ke pusat kendali sistem akademik</p>
              </div>
              <Link
                href="/auth/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-600 font-bold text-xs border border-slate-200 transition-all shadow-xs"
              >
                <span>Portal Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-6 text-[11px] text-slate-400 flex items-center gap-3 border-t border-slate-100 mt-6 font-medium">
            <span>Gradia Academic System</span>
            <span>•</span>
            <span className="text-slate-500">Akun baru didaftarkan resmi oleh Administrator</span>
          </div>
        </div>

        {/* BAGIAN KANAN: INFORMASI AI & ILUSTRASI */}
        <div className="lg:col-span-6 bg-[#F8FAFC] p-8 md:p-10 flex flex-col justify-between border-l border-slate-100">
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-emerald-100 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Penilaian Akademik Terpadu
            </div>
          </div>

          <div className="my-auto py-8">
            <div className="relative w-full max-w-[340px] aspect-square mx-auto mb-6">
              <Image
                src={ilutrasiImg}
                alt="Ilustrasi Akademik"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">
                    Kecerdasan Buatan Terintegrasi (AI Feedback)
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Membantu dosen mengevaluasi nilai dan memberikan umpan balik akademik mahasiswa secara otomatis dan objektif.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">
                    Rekapitulasi Nilai & Cetak Laporan Cepat
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Import data nilai dari Excel serta cetak berita acara dan transkrip kelas dalam format PDF siap pakai.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left text-xs text-slate-400">
            © 2024–2025 Gradia. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </div>
    </div>
  );
}