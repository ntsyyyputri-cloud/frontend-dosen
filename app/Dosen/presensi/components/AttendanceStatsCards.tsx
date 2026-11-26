"use client";

import React from "react";
import { CheckCircle2, Clock, Stethoscope, AlertCircle } from "lucide-react";
import { AttendanceStats } from "@/types/attendance";

interface AttendanceStatsCardsProps {
  stats: AttendanceStats;
}

export function AttendanceStatsCards({ stats }: AttendanceStatsCardsProps) {
  const cards = [
    {
      label: "Hadir",
      value: stats.hadir,
      sub: `dari ${stats.total} mahasiswa`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      valueColor: "text-emerald-700",
    },
    {
      label: "Izin",
      value: stats.izin,
      sub: "pengajuan izin",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      valueColor: "text-amber-700",
    },
    {
      label: "Sakit",
      value: stats.sakit,
      sub: "surat sakit / keterangan",
      icon: Stethoscope,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      valueColor: "text-blue-700",
    },
    {
      label: "Alpha",
      value: stats.alpa,
      sub: stats.belum > 0 ? `+ ${stats.belum} belum absen` : "tanpa keterangan",
      icon: AlertCircle,
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      valueColor: "text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

