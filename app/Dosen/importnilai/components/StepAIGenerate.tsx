"use client";

import React from "react";
import { Sparkles, ArrowLeft, Lock } from "lucide-react";
import { ImportPreviewRow, AIClassSummary } from "@/types/importNilai";

interface StepAIGenerateProps {
  previewData: ImportPreviewRow[];
  summary: AIClassSummary | null;
  onBack: () => void;
  onLock: () => void;
}

export function StepAIGenerate({
  previewData,
  summary,
  onBack,
  onLock,
}: StepAIGenerateProps) {
  return (
    <div className="space-y-6">
      {/* AI Summary Banner */}
      {summary && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300" />
            <h3 className="font-bold text-sm tracking-wide">
              Evaluasi Capaian Pembelajaran AI
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-emerald-300 font-bold block mb-1">Kekuatan Kelas</span>
              <p className="text-purple-100 leading-relaxed">{summary.strength}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-amber-300 font-bold block mb-1">Aspek Peningkatan</span>
              <p className="text-purple-100 leading-relaxed">{summary.improvement}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-cyan-300 font-bold block mb-1">Rekomendasi Tindak Lanjut</span>
              <p className="text-purple-100 leading-relaxed">{summary.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Student rows with individual AI Feedback */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">Nama Mahasiswa</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4">Feedback Otomatis AI (Rubrik OBE)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-700">{row.nim}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-600">{row.finalScore}</td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                    {row.aiFeedback || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Preview</span>
        </button>

        <button
          type="button"
          onClick={onLock}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Kunci Nilai & Selesaikan</span>
        </button>
      </div>
    </div>
  );
}

