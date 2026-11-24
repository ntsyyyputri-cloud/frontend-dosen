"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  KeyRound,
  Send,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ForgotPasswordCardProps {
  onClose: () => void;
}

export function ForgotPasswordCard({ onClose }: ForgotPasswordCardProps) {
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Notifikasi error otomatis hilang setelah 5 detik
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Masukkan NIDN atau email kampus Anda.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{ message?: string; email?: string }>(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ identifier: email.trim() }),
        }
      );
      setSentEmail(res.email || email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Gagal mengirim tautan reset kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  const getMailUrl = (targetEmail: string) => {
    const lower = targetEmail.toLowerCase();
    if (
      lower.includes("@outlook.") ||
      lower.includes("@hotmail.") ||
      lower.includes("office365")
    ) {
      return "https://outlook.office.com/mail/";
    }
    return "https://mail.google.com";
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* Notifikasi Peringatan (Toast yang hilang otomatis dalam beberapa detik) */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2.5 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs font-medium backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Card */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* State: sudah terkirim (header atas dihilangkan, dimulai langsung dari centang) */}
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Tautan Reset Telah Dikirim!
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Silakan periksa kotak masuk email kampus Anda
              {sentEmail ? (
                <> (<span className="font-semibold text-slate-700">{sentEmail}</span>)</>
              ) : null}
              . Jika tidak menerima email dalam beberapa menit, hubungi Administrator.
            </p>

            {/* Tombol Biru: Buka Email */}
            <a
              href={getMailUrl(sentEmail || email)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Buka Email</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              masuk ke halaman email
            </button>
          </div>
        ) : (
          <>
            {/* Icon + Judul hanya tampil sebelum dikirim */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Lupa Kata Sandi?</h2>
              <p className="text-xs text-slate-500 text-center mt-1 leading-relaxed">
                Masukkan NIDN atau email kampus Anda. Kami akan mengirimkan tautan
                untuk mengatur ulang kata sandi.
              </p>
            </div>

            {/* Form kirim reset */}
            <form onSubmit={handleSend} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="NIDN atau email@kampus.ac.id"
                  className={`w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                    error
                      ? "border-rose-300 ring-2 ring-rose-100"
                      : "border-slate-200 focus:ring-2 focus:ring-[#4F46E5]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim tautan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Tautan Reset Sandi</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] text-slate-400">atau</span>
              </div>
            </div>

            {/* Hubungi Admin — layout 2 kolom berdampingan */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[11px] font-semibold text-slate-600 text-center mb-3">
                Hubungi Administrator Kampus
              </p>

              {/* Grid 2 kolom */}
              <div className="grid grid-cols-2 gap-3">
                {/* Kolom Email */}
                <a
                  href="mailto:admin@gradia.ac.id"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-all">
                    <Mail className="w-3.5 h-3.5 text-[#4F46E5]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 mb-0.5">Email Admin</p>
                    <p className="text-[10px] font-medium text-[#4F46E5] break-all leading-tight">
                      admin@gradia.ac.id
                    </p>
                  </div>
                </a>

                {/* Kolom WhatsApp */}
                <a
                  href="https://wa.me/6282313233192"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-all">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 mb-0.5">WhatsApp </p>
                    <p className="text-[10px] font-medium text-emerald-600 leading-tight">
                      +62 823-1323-3192
                    </p>
                  </div>
                </a>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-3">
                Admin akan membantu mengatur ulang kata sandi Anda pada jam kerja.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
