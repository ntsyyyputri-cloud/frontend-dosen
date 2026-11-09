"use client";

import React from "react";
import { Search } from "lucide-react";
import { FilterTab } from "@/types/grade";

interface GradeFilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function GradeFilterTabs({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
}: GradeFilterTabsProps) {
  const tabs: FilterTab[] = ["Semua", "Lulus", "Remedial"];

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM atau Nama Mahasiswa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
          />
        </div>
        <span className="text-[11px] text-slate-500 font-medium shrink-0">
          {filteredCount} / {totalCount} Mahasiswa
        </span>
      </div>
    </div>
  );
}

