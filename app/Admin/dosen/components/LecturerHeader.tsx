import React from "react";
import { GraduationCap, RefreshCw, UserPlus } from "lucide-react";

interface LecturerHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export function LecturerHeader({
  isLoading,
  onRefresh,
  onOpenCreateModal,
}: LecturerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="notranslate" translate="no">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 notranslate" translate="no">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span className="notranslate" translate="no">Manajemen Akun & Data Dosen</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1 notranslate" translate="no">
          Kelola hak akses pengajar, penugasan kelas, dan aktivasi akun dosen resmi kampus.
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
          <span>Tambah Dosen Baru</span>
        </button>
      </div>
    </div>
  );
}

