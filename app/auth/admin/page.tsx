"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/image/logo.png";
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  Eye,
  EyeOff,
  Layers,
  GraduationCap,
  Users,
  Building,
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
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* BAGIAN KIRI: FORM LOGIN ADMIN */}
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
                <p className="text-xs text-amber-700 font-semibold">
                  Portal Administrator Kampus
                </p>
              </div>
            </div>

            {/* Judul & Deskripsi */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-[11px] mb-2 border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Pusat Kendali Utama Akademik</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Login Administrator
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                Akses khusus pengelola sistem untuk administrasi dosen, mahasiswa, dan pemantauan perkuliahan kampus.
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
                  {redirectToDosen && (
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
                    >
                      <span>Buka Halaman Login Dosen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}

              {/* Username / Email Admin */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Username atau Email Administrator *
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Kata Sandi Administrator *
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
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">
                    Ingat sesi Administrator
                  </span>
                </label>
              </div>

              {/* Action Button */}
              <div className="space-y-3 pt-2">
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
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Bukan Administrator?</p>
                <p className="text-[11px] text-slate-500">Masuk sebagai dosen pengampu kelas</p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all shadow-xs"
              >
                <span>Portal Dosen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-6 text-[11px] text-slate-400 flex items-center gap-3 border-t border-slate-100 mt-6 font-medium">
            <span>Sistem Informasi Akademik Gradia</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">Tingkat Keamanan Tinggi (RBAC)</span>
          </div>
        </div>

        {/* BAGIAN KANAN: PANEL ADMINISTRATOR */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-10 flex flex-col justify-between text-white border-l border-slate-800">
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Portal Khusus Administrator Kampus
            </div>
          </div>

          <div className="my-auto py-8 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Pusat Manajemen & Kontrol Akademik
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Kelola hak akses pengajar, validasi data kemahasiswaan, dan pantau kelengkapan nilai perkuliahan di seluruh program studi dari satu panel terintegrasi.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-100">Registrasi & Kelola Akun Dosen</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Buat akun dosen resmi secara terpusat untuk menjaga integritas data akademik institusi.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-100">Master Data Mahasiswa</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Manajemen NIM, program studi, dan kepesertaan kelas mahasiswa lintas fakultas.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-100">Monitoring Perkuliahan Kampus</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Pantau progres pengisian nilai dan rekapitulasi nilai akhir semester secara transparan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left text-xs text-slate-400">
            © 2024–2025 Gradia. Hak Akses Terbatas untuk Administrator.
          </div>
        </div>
      </div>
    </div>
  );
}
