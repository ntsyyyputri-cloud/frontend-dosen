"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, UserPlus, Users, RefreshCw } from "lucide-react";

export interface AdminWelcomeBannerProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AdminWelcomeBanner({
  isLoading,
  onRefresh,
}: AdminWelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
      <div className="relative z-10 max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Pusat Kendali Akademik Terpadu</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Selamat Datang di Portal Administrator Gradia
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Kelola master data dosen, mahasiswa, serta pantau kelengkapan nilai perkuliahan di seluruh program studi secara efisien dan real-time.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 relative z-10">
        <Link
          href="/Admin/dosen"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all text-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Kelola Akun Dosen</span>
        </Link>
        <Link
          href="/Admin/mahasiswa"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/10 transition-all text-xs"
        >
          <Users className="w-4 h-4" />
          <span>Master Data Mahasiswa</span>
        </Link>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
}

