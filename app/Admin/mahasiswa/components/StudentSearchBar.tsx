"use client";

import React from "react";
import { Search } from "lucide-react";
import { PRODI_OPTIONS } from "@/types/student";

interface StudentSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedProdi: string;
  onProdiChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function StudentSearchBar({
  searchQuery,
  onSearchChange,
  selectedProdi,
  onProdiChange,
  filteredCount,
  totalCount,
}: StudentSearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIM, nama, atau email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Prodi */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedProdi}
            onChange={(e) => onProdiChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
          >
            {PRODI_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-xs text-slate-500 font-medium">
        Menampilkan <span className="font-bold text-slate-800">{filteredCount}</span> dari{" "}
        <span className="font-bold text-slate-800">{totalCount}</span> mahasiswa
      </div>
    </div>
  );
}

