"use client";

import React from "react";
import { Calendar, Radio, Search, RefreshCw, X, Lock, Unlock } from "lucide-react";
import { AttendanceStatus } from "@/types/attendance";

interface AttendanceFilterBarProps {
  pertemuan: number;
  onPertemuanChange: (pertemuan: number) => void;
  sessionDate: string;
  isSessionOpen: boolean;
  isTogglingSession: boolean;
  onToggleSession: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | AttendanceStatus;
  onStatusFilterChange: (status: "all" | AttendanceStatus) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function AttendanceFilterBar({
  pertemuan,
  onPertemuanChange,
  sessionDate,
  isSessionOpen,
  isTogglingSession,
  onToggleSession,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing,
}: AttendanceFilterBarProps) {
  const statusOptions: { key: "all" | AttendanceStatus; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "hadir", label: "Hadir" },
    { key: "izin", label: "Izin" },
    { key: "sakit", label: "Sakit" },
    { key: "alpa", label: "Alpha" },
    { key: "belum", label: "Belum Absen" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
      {/* Row 1: Pertemuan, Tanggal, Aksi Sesi Mobile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pertemuan Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="select-pertemuan" className="text-xs font-semibold text-slate-600">
              Pertemuan:
            </label>
            <select
              id="select-pertemuan"
              value={pertemuan}
              onChange={(e) => onPertemuanChange(Number(e.target.value))}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {Array.from({ length: 16 }, (_, idx) => idx + 1).map((num) => (
                <option key={num} value={num}>
                  Pertemuan {num}
                </option>
              ))}
            </select>
          </div>

          {/* Date Pill */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5" />
            {sessionDate || "Hari Ini"}
          </span>

          {/* Live Status Pill */}
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${
              isSessionOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <Radio className={`w-3 h-3 ${isSessionOpen ? "text-emerald-600 animate-pulse" : "text-slate-400"}`} />
            {isSessionOpen ? "Sesi Mobile Aktif" : "Sesi Mobile Ditutup"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-60"
            title="Segarkan data real-time dari mobile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
            <span>Sinkronkan</span>
          </button>

          <button
            type="button"
            onClick={onToggleSession}
            disabled={isTogglingSession}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-60 active:scale-[0.98] ${
              isSessionOpen
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isSessionOpen ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>{isTogglingSession ? "Memproses..." : "Tutup Sesi Presensi"}</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>{isTogglingSession ? "Memproses..." : "Buka Sesi Presensi Mobile"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Filter Pills & Search */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusOptions.map((opt) => {
            const active = statusFilter === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onStatusFilterChange(opt.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM atau Nama Mahasiswa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
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

