"use client";

import React from "react";
import { Sparkles, Bot, Star, Award, Flag } from "lucide-react";
import { AIAnalysisData } from "@/types/analytics";

interface AiEvaluationCardProps {
  analysis: AIAnalysisData | null;
  onGenerateAI: () => void;
  generatingAI: boolean;
}

export function AiEvaluationCard({
  analysis,
  onGenerateAI,
  generatingAI,
}: AiEvaluationCardProps) {
  if (!analysis) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-600/20">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            AI Rubrik Feedback Belum Diterbitkan
          </h3>
          <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
            Tekan tombol di bawah untuk meminta modul cerdas mengevaluasi kurva sebaran nilai, menganalisis penguasaan CPL, dan merumuskan saran pedagogis.
          </p>
        </div>
        <button
          type="button"
          disabled={generatingAI}
          onClick={onGenerateAI}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          <span>{generatingAI ? "Menganalisis..." : "Mulai Evaluasi AI"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Hasil Analisis & Rekomendasi Cerdas AI
            </h3>
            <span className="text-[10px] text-slate-400">Model: {analysis.source}</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
          OBE Analysis Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
            <Star className="w-4 h-4 text-emerald-600" />
            <span>Kekuatan & Capaian Unggul</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">{analysis.strength}</p>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
            <Flag className="w-4 h-4 text-amber-600" />
            <span>Aspek Yang Perlu Ditingkatkan</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">{analysis.improvement}</p>
        </div>

        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Rekomendasi Tindak Lanjut</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">{analysis.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

