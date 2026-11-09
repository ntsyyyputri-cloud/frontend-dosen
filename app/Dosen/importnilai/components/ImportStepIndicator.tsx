"use client";

import React from "react";
import { Check } from "lucide-react";

interface ImportStepIndicatorProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function ImportStepIndicator({
  currentStep,
  onStepChange,
}: ImportStepIndicatorProps) {
  const steps = [
    { num: 1, label: "Unggah File Excel/CSV" },
    { num: 2, label: "Validasi & Preview Data" },
    { num: 3, label: "Generate AI & Evaluasi" },
    { num: 4, label: "Kunci & Sinkronisasi" },
  ];

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
      {steps.map((s, idx) => {
        const isDone = currentStep > s.num;
        const isCurrent = currentStep === s.num;

        return (
          <React.Fragment key={s.num}>
            <button
              type="button"
              onClick={() => onStepChange(s.num)}
              className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isCurrent ? "text-indigo-600" : isDone ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-3 hidden sm:block ${
                  currentStep > s.num ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

