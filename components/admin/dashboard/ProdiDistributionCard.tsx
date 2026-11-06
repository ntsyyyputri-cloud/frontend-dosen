"use client";

import React from "react";
import { Building } from "lucide-react";
import { ProdiStat } from "@/types/admin";

export interface ProdiDistributionCardProps {
  prodiDistribution: ProdiStat[];
  totalStudents: number;
}

export default function ProdiDistributionCard({
  prodiDistribution,
  totalStudents,
}: ProdiDistributionCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">
            Sebaran Mahasiswa per Prodi
          </h2>
          <p className="text-slate-400 text-[11px]">Distribusi kuota akademik kampus</p>
        </div>
        <Building className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-3 pt-2">
        {prodiDistribution.length === 0 ? (
          <p className="text-slate-400 italic text-center py-6">
            Belum ada data distribusi program studi.
          </p>
        ) : (
          prodiDistribution.map((item, idx) => {
            const total = totalStudents || 1;
            const percent = Math.round((item.count / total) * 100);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{item.prodi}</span>
                  <span className="text-slate-500 font-bold">
                    {item.count} Mhs{" "}
                    <span className="text-slate-400 font-normal">({percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx % 3 === 0
                        ? "bg-indigo-600"
                        : idx % 3 === 1
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.max(percent, 8)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

