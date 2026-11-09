"use client";

import React from "react";
import { Users, UserPlus, RefreshCw } from "lucide-react";

interface StudentHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export function StudentHeader({
  isLoading,
  onRefresh,
  onOpenCreateModal,
}: StudentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>Master Data Mahasiswa Kampus</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Data induk mahasiswa seluruh program studi, status keaktifan akademik, dan kepesertaan kelas.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-all"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Mahasiswa</span>
        </button>
      </div>
    </div>
  );
}

