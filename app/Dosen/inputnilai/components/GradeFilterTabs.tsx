"use client";

import React from "react";
import { Search, X, CheckCheck, Trash2 } from "lucide-react";
import { FilterTab } from "@/types/grade";

interface GradeFilterTabsProps {
  activeTab: FilterTab | "Belum lengkap";
  onTabChange: (tab: any) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts: {
    semua: number;
    lulus: number;
    remedial: number;
    belumLengkap: number;
  };
  selectedCount?: number;
  onQuickFillSelected?: () => void;
  onClearSelected?: () => void;
}

export function GradeFilterTabs({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  counts,
  selectedCount = 0,
  onQuickFillSelected,
  onClearSelected,
}: GradeFilterTabsProps) {
  const tabs = [
    { key: "Semua", label: "Semua", count: counts.semua },
    { key: "Lulus", label: "Lulus", count: counts.lulus },
    { key: "Remedial", label: "Remedial", count: counts.remedial },
    { key: "Belum lengkap", label: "Belum Lengkap", count: counts.belumLengkap },
  ];

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? "bg-blue-700/80 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Action Bar & Search */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
        {/* Bulk Action Controls */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-1 rounded-xl text-xs animate-in fade-in">
            <span className="font-bold text-[11px]">{selectedCount} terpilih</span>
            {onQuickFillSelected && (
              <button
                type="button"
                onClick={onQuickFillSelected}
                className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[11px] transition-all"
                title="Isi nilai cepat"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Isi</span>
              </button>
            )}
            {onClearSelected && (
              <button
                type="button"
                onClick={onClearSelected}
                className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-medium text-[11px] transition-all"
                title="Kosongkan nilai terpilih"
              >
                <Trash2 className="w-3 h-3" />
                <span>Kosongkan</span>
              </button>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM atau Nama Mahasiswa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
