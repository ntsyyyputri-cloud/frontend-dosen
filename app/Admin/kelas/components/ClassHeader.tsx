"use client";

import React from "react";
import { Layers, Plus, RefreshCw } from "lucide-react";

interface ClassHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export function ClassHeader({
  isLoading,
  onRefresh,
  onOpenCreateModal,
}: ClassHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>Manajemen & Tambah Data Kelas</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Kelola rombongan belajar, tambah kelas perkuliahan baru, penugasan dosen pengampu, dan mahasiswa kelas.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition-all"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

