import React from "react";
import { Search } from "lucide-react";

interface LecturerSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function LecturerSearchBar({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
}: LecturerSearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, NIDN, atau email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
        />
      </div>

      <div className="text-xs text-slate-500 font-medium">
        Menampilkan <span className="font-bold text-slate-800">{filteredCount}</span> dari{" "}
        <span className="font-bold text-slate-800">{totalCount}</span> dosen
      </div>
    </div>
  );
}

