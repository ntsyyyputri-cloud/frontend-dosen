"use client";

import React from "react";
import {
  FileText,
  Award,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sliders,
} from "lucide-react";
import { WeightConfig } from "@/types/grade";
import { WEIGHT_PRESETS } from "@/hooks/useInputNilai";

interface GradeStatsCardsProps {
  averages: {
    tugas: string;
    uts: string;
    uas: string;
    final: string;
  };
  totalStudents: number;
  weights: WeightConfig;
  onWeightChange: (field: keyof WeightConfig, val: number) => void;
  totalWeight: number;
  isWeightValid: boolean;
  onApplyPreset: (preset: WeightConfig) => void;
}

export function GradeStatsCards({
  averages,
  totalStudents,
  weights,
  onWeightChange,
  totalWeight,
  isWeightValid,
  onApplyPreset,
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

      {/* 4 Stats Cards with Directly Editable Weights */}
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

            {/* Directly editable Bobot */}
            <div className="flex items-center gap-1 bg-blue-50/90 border border-blue-200 px-2 py-0.5 rounded-lg">
              <label htmlFor="bobot-tugas" className="text-[10px] font-bold text-blue-700">
                Bobot
              </label>
              <input
                id="bobot-tugas"
                type="number"
                min={0}
                max={100}
                value={weights.tugas}
                onChange={(e) => onWeightChange("tugas", parseInt(e.target.value) || 0)}
                className="w-10 px-1 py-0.2 text-center text-xs font-bold text-blue-800 bg-white border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-[10px] font-bold text-blue-700">%</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {averages.tugas}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Formatif berkala
            </span>
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

            {/* Directly editable Bobot */}
            <div className="flex items-center gap-1 bg-amber-50/90 border border-amber-200 px-2 py-0.5 rounded-lg">
              <label htmlFor="bobot-uts" className="text-[10px] font-bold text-amber-700">
                Bobot
              </label>
              <input
                id="bobot-uts"
                type="number"
                min={0}
                max={100}
                value={weights.uts}
                onChange={(e) => onWeightChange("uts", parseInt(e.target.value) || 0)}
                className="w-10 px-1 py-0.2 text-center text-xs font-bold text-amber-800 bg-white border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <span className="text-[10px] font-bold text-amber-700">%</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {averages.uts}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Ujian Tengah Sem
            </span>
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

            {/* Directly editable Bobot */}
            <div className="flex items-center gap-1 bg-purple-50/90 border border-purple-200 px-2 py-0.5 rounded-lg">
              <label htmlFor="bobot-uas" className="text-[10px] font-bold text-purple-700">
                Bobot
              </label>
              <input
                id="bobot-uas"
                type="number"
                min={0}
                max={100}
                value={weights.uas}
                onChange={(e) => onWeightChange("uas", parseInt(e.target.value) || 0)}
                className="w-10 px-1 py-0.2 text-center text-xs font-bold text-purple-800 bg-white border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <span className="text-[10px] font-bold text-purple-700">%</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {averages.uas}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Ujian Akhir Sem
            </span>
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

      {/* Quick Presets Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap px-3 py-2 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span>Preset Bobot Cepat:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {WEIGHT_PRESETS.map((preset) => {
            const isMatch =
              weights.tugas === preset.weights.tugas &&
              weights.uts === preset.weights.uts &&
              weights.uas === preset.weights.uas;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onApplyPreset(preset.weights)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  isMatch
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
