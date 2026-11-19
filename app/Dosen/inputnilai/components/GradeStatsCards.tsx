"use client";

import React from "react";
import {
  FileText,
  Award,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { WeightConfig } from "@/types/grade";

interface GradeStatsCardsProps {
  averages: {
    tugas: string;
    uts: string;
    uas: string;
    final: string;
  };
  totalStudents: number;
  weights: WeightConfig;
  totalWeight: number;
  isWeightValid: boolean;
}

export function GradeStatsCards({
  averages,
  totalStudents,
  weights,
  totalWeight,
  isWeightValid,
}: GradeStatsCardsProps) {
  return (
    <div className="space-y-3">
      {/* Bobot Alert Banner if total != 100% */}
      {!isWeightValid && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border border-amber-200/90 text-amber-800 rounded-xl text-xs font-medium animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Perhatian:</strong> Total bobot komponen saat ini adalah{" "}
            <strong className="underline decoration-amber-500 font-bold">{totalWeight}%</strong>.
            Pastikan total akumulasi bobot Tugas, UTS, dan UAS bernilai <strong>100%</strong> agar kalkulasi nilai akhir OBE valid.
          </span>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tugas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Rata-rata Tugas
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {weights.tugas}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {averages.tugas}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Formatif berkala</span>
          </div>
        </div>

        {/* Card 2: UTS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Rata-rata UTS
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {weights.uts}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {averages.uts}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Ujian Tengah Sem</span>
          </div>
        </div>

        {/* Card 3: UAS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Rata-rata UAS
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {weights.uas}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {averages.uas}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Ujian Akhir Sem</span>
          </div>
        </div>

        {/* Card 4: Nilai Akhir Kelas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Rata-rata Kelas
              </span>
            </div>
            {/* Total Bobot indicator */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isWeightValid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
              }`}
            >
              {isWeightValid ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  100% Valid
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  {totalWeight}% (Harus 100%)
                </>
              )}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
              {averages.final}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
              {totalStudents} Mhs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
