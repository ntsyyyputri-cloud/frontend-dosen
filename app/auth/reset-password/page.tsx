"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      if (!token.trim()) {
        if (active) {
          setIsTokenValid(false);
          setTokenError("Tautan reset kata sandi tidak ditemukan atau tidak valid.");
          setIsVerifying(false);
        }
        return;
      }

      try {
        await apiFetch(`/auth/reset-password/verify?token=${encodeURIComponent(token.trim())}`);
        if (active) {
          setIsTokenValid(true);
        }
      } catch (err: any) {
        if (active) {
          setIsTokenValid(false);
          setTokenError(
            err?.message || "Tautan reset kata sandi tidak valid atau sudah kedaluwarsa."
          );
        }
      } finally {
        if (active) setIsVerifying(false);
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (newPassword.length < 6) {
      setSubmitError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
        }),
      });
      setIsSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSubmitError(err?.message || "Gagal memperbarui kata sandi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-7">
        {isVerifying ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            <p className="text-xs text-slate-500 font-medium">
              Memverifikasi tautan reset kata sandi...
            </p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-base font-bold text-slate-800">
              Kata Sandi Berhasil Diperbarui
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kata sandi akun dosen Anda telah disimpan. Silakan login menggunakan kata sandi baru Anda.
            </p>
            <Link
              href="/auth/login"
              className="mt-3 w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Kembali ke Halaman Login</span>
            </Link>
          </div>
        ) : !isTokenValid ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-1">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-base font-bold text-slate-800">
              Tautan Tidak Valid
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">{tokenError}</p>
            <Link
              href="/auth/login"
              className="mt-3 w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Login</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <h1 className="text-base font-bold text-slate-800">
                Buat Kata Sandi Baru
              </h1>
              <p className="text-xs text-slate-500 text-center mt-1 leading-relaxed">
                Masukkan kata sandi baru untuk akun Portal Dosen Gradia Anda.
              </p>
            </div>

            {submitError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    minLength={6}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Kata Sandi Baru</span>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Kembali ke halaman login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
