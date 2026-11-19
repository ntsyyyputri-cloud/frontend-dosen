"use client";

import React, { useState, useEffect } from "react";
import { X, Sliders, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { WeightConfig } from "@/types/grade";
import { WEIGHT_PRESETS } from "@/hooks/useInputNilai";

interface WeightSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: WeightConfig;
  onWeightChange: (field: keyof WeightConfig, val: number) => void;
  totalWeight: number;
  isWeightValid: boolean;
  onApplyPreset: (preset: WeightConfig) => void;
}

export function WeightSettingsModal({
  isOpen,
  onClose,
  weights,
  onWeightChange,
  totalWeight,
  isWeightValid,
  onApplyPreset,
}: WeightSettingsModalProps) {
  const [localWeights, setLocalWeights] = useState<WeightConfig>(weights);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) setLocalWeights(weights);
  }, [isOpen, weights]);

  const localTotal = localWeights.tugas + localWeights.uts + localWeights.uas;
  const localValid = localTotal === 100;

  const handleLocalChange = (field: keyof WeightConfig, val: number) => {
    setLocalWeights((prev) => ({ ...prev, [field]: val }));
  };

  const handleApplyPreset = (preset: WeightConfig) => {
    setLocalWeights(preset);
  };

  const handleSave = () => {
    if (!localValid) return;
    onWeightChange("tugas", localWeights.tugas);
    onWeightChange("uts", localWeights.uts);
    onWeightChange("uas", localWeights.uas);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Sliders className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Atur Bobot Nilai</h3>
              <p className="text-[11px] text-slate-500">Total bobot harus berjumlah 100%</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Total Bobot Indicator */}
          <div
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              localValid
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <span>Total Bobot Saat Ini</span>
            <div className="flex items-center gap-1.5">
              {localValid ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              )}
              <span className="font-bold text-base">{localTotal}%</span>
              {!localValid && (
                <span className="text-[10px] font-normal ml-1">
                  (Kurang {100 - localTotal > 0 ? `${100 - localTotal}%` : `lebih ${localTotal - 100}%`})
                </span>
              )}
            </div>
          </div>

          {/* Weight Inputs */}
          <div className="space-y-3">
            {/* Tugas */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <label htmlFor="modal-bobot-tugas" className="text-sm font-semibold text-slate-700">
                  Tugas
                </label>
                <p className="text-[10px] text-slate-400">Penilaian formatif berkala</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleLocalChange("tugas", Math.max(0, localWeights.tugas - 5))}
                    className="px-2.5 py-1.5 text-blue-700 hover:bg-blue-100 font-bold text-sm transition-all"
                  >
                    −
                  </button>
                  <input
                    id="modal-bobot-tugas"
                    type="number"
                    min={0}
                    max={100}
                    value={localWeights.tugas}
                    onChange={(e) => handleLocalChange("tugas", parseInt(e.target.value) || 0)}
                    className="w-14 py-1.5 text-center text-sm font-bold text-blue-800 bg-white border-x border-blue-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleLocalChange("tugas", Math.min(100, localWeights.tugas + 5))}
                    className="px-2.5 py-1.5 text-blue-700 hover:bg-blue-100 font-bold text-sm transition-all"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-bold text-slate-500 w-5">%</span>
              </div>
            </div>

            {/* UTS */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <label htmlFor="modal-bobot-uts" className="text-sm font-semibold text-slate-700">
                  UTS
                </label>
                <p className="text-[10px] text-slate-400">Ujian Tengah Semester</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleLocalChange("uts", Math.max(0, localWeights.uts - 5))}
                    className="px-2.5 py-1.5 text-amber-700 hover:bg-amber-100 font-bold text-sm transition-all"
                  >
                    −
                  </button>
                  <input
                    id="modal-bobot-uts"
                    type="number"
                    min={0}
                    max={100}
                    value={localWeights.uts}
                    onChange={(e) => handleLocalChange("uts", parseInt(e.target.value) || 0)}
                    className="w-14 py-1.5 text-center text-sm font-bold text-amber-800 bg-white border-x border-amber-200 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleLocalChange("uts", Math.min(100, localWeights.uts + 5))}
                    className="px-2.5 py-1.5 text-amber-700 hover:bg-amber-100 font-bold text-sm transition-all"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-bold text-slate-500 w-5">%</span>
              </div>
            </div>

            {/* UAS */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <label htmlFor="modal-bobot-uas" className="text-sm font-semibold text-slate-700">
                  UAS
                </label>
                <p className="text-[10px] text-slate-400">Ujian Akhir Semester</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-purple-50 border border-purple-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleLocalChange("uas", Math.max(0, localWeights.uas - 5))}
                    className="px-2.5 py-1.5 text-purple-700 hover:bg-purple-100 font-bold text-sm transition-all"
                  >
                    −
                  </button>
                  <input
                    id="modal-bobot-uas"
                    type="number"
                    min={0}
                    max={100}
                    value={localWeights.uas}
                    onChange={(e) => handleLocalChange("uas", parseInt(e.target.value) || 0)}
                    className="w-14 py-1.5 text-center text-sm font-bold text-purple-800 bg-white border-x border-purple-200 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleLocalChange("uas", Math.min(100, localWeights.uas + 5))}
                    className="px-2.5 py-1.5 text-purple-700 hover:bg-purple-100 font-bold text-sm transition-all"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-bold text-slate-500 w-5">%</span>
              </div>
            </div>
          </div>

          {/* Preset Bobot Cepat */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Preset Bobot Cepat
            </p>
            <div className="flex flex-wrap gap-1.5">
              {WEIGHT_PRESETS.map((preset) => {
                const isMatch =
                  localWeights.tugas === preset.weights.tugas &&
                  localWeights.uts === preset.weights.uts &&
                  localWeights.uas === preset.weights.uas;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.weights)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isMatch
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation error */}
          {!localValid && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
              <span>
                Total bobot harus tepat <strong>100%</strong>. Saat ini:{" "}
                <strong>{localTotal}%</strong>. Sesuaikan nilai Tugas, UTS, atau UAS.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={() => handleApplyPreset({ tugas: 25, uts: 35, uas: 40 })}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!localValid}
              title={!localValid ? `Total bobot harus 100% (saat ini ${localTotal}%)` : "Simpan bobot nilai"}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-all"
            >
              Simpan Bobot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

