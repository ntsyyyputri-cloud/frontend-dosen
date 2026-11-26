"use client";

import React, { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2, Save, X } from "lucide-react";
import { useInputNilai } from "@/hooks/useInputNilai";
import { ScoreField } from "@/types/grade";
import {
  GradeClassHeader,
  GradeFilterTabs,
  GradeTable,
  WeightSettingsModal,
} from "./components";

export default function InputNilaiPage() {
  const {
    classes,
    activeClassId,
    loadGradesForClass,
    handleSaveGrades,
    weights,
    totalWeight,
    isWeightValid,
    handleWeightChange,
    applyPresetWeights,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleScoreChange,
    handleQuickFillSelected,
    handleClearSelected,
    calculateFinalGrade,
    filteredStudents,
    averages,
    counts,
    showToast,
    toastMessage,
    isSaving,
  } = useInputNilai();

  // Weight Settings Modal State
  const [isWeightSettingsOpen, setIsWeightSettingsOpen] = useState(false);

  // Bulk Quick Fill State
  const [isQuickFillOpen, setIsQuickFillOpen] = useState(false);
  const [quickFillField, setQuickFillField] = useState<ScoreField>("tugas");
  const [quickFillScore, setQuickFillScore] = useState<number>(80);

  const handleApplyQuickFill = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickFillSelected(quickFillField, quickFillScore);
    setIsQuickFillOpen(false);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-hidden">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Sidebar */}
        <Sidebar currentPath="/dosen/inputnilai" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <Header breadcrumbs={["Portal", "Penilaian & Evaluasi", "Input Rekap Nilai"]} />

          {/* Main Content */}
          <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header & Class Switcher */}
            <GradeClassHeader
              classes={classes}
              activeClassId={activeClassId}
              onClassChange={loadGradesForClass}
              onOpenWeightSettings={() => setIsWeightSettingsOpen(true)}
              isWeightValid={isWeightValid}
              totalWeight={totalWeight}
            />

            {/* Filter Tabs & Search */}
            <GradeFilterTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              counts={counts}
              selectedCount={selectedIds.length}
              onClearSelected={handleClearSelected}
            />

            {/* Grade Table */}
            <GradeTable
              students={filteredStudents}
              selectedIds={selectedIds}
              weights={weights}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onScoreChange={handleScoreChange}
              calculateFinalGrade={calculateFinalGrade}
            />

            {/* Bottom Save Action */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveGrades}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-xs text-xs disabled:opacity-60 cursor-pointer active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Menyimpan..." : "Simpan Rekap"}</span>
              </button>
            </div>
          </main>
        </div>

        {/* Modal Pengaturan Bobot Nilai */}
        <WeightSettingsModal
          isOpen={isWeightSettingsOpen}
          onClose={() => setIsWeightSettingsOpen(false)}
          weights={weights}
          onWeightChange={handleWeightChange}
          totalWeight={totalWeight}
          isWeightValid={isWeightValid}
          onApplyPreset={applyPresetWeights}
        />

        {/* Modal Bulk Quick Fill */}
        {isQuickFillOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">
                  Isi Nilai Cepat ({selectedIds.length} Mahasiswa)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQuickFillOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApplyQuickFill} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Komponen Nilai:
                  </label>
                  <select
                    value={quickFillField}
                    onChange={(e) => setQuickFillField(e.target.value as ScoreField)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tugas">Tugas ({weights.tugas}%)</option>
                    <option value="uts">UTS ({weights.uts}%)</option>
                    <option value="uas">UAS ({weights.uas}%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nilai yang Diinput (0 - 100):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={quickFillScore}
                    onChange={(e) => setQuickFillScore(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickFillOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all"
                  >
                    Terapkan Nilai
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
