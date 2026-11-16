"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2 } from "lucide-react";
import { useInputNilai } from "@/hooks/useInputNilai";
import { gradeService } from "@/services/gradeService";
import { GradeAppeal } from "@/types/grade";
import {
  GradeClassHeader,
  GradeStatsCards,
  GradeFilterTabs,
  GradeTable,
  GradeAppealsModal,
} from "./components";

export default function InputNilaiPage() {
  const {
    classes,
    activeClassId,
    loadGradesForClass,
    handleSaveGrades,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleScoreChange,
    calculateFinalGrade,
    filteredStudents,
    averages,
    showToast,
    toastMessage,
    isSaving,
  } = useInputNilai();

  const [isAppealsOpen, setIsAppealsOpen] = useState(false);
  const [appeals, setAppeals] = useState<GradeAppeal[]>([]);

  useEffect(() => {
    if (!activeClassId) return;
    gradeService
      .getAppealsByClass(activeClassId)
      .then((res) => {
        if (res && res.appeals) setAppeals(res.appeals);
      })
      .catch((err) => {
        console.warn("Gagal memuat sanggahan nilai:", err);
      });
  }, [activeClassId]);

  const handleUpdateAppealStatus = async (
    appealId: number,
    status: "approved" | "rejected",
    response?: string
  ) => {
    try {
      await gradeService.updateAppeal(appealId, status, response);
      setAppeals((prev) =>
        prev.map((a) =>
          a.id === appealId
            ? { ...a, status, lecturer_response: response || null }
            : a
        )
      );
    } catch (err: any) {
      console.error("Gagal mengupdate status sanggahan:", err);
    }
  };

  const pendingAppealsCount = appeals.filter((a) => a.status === "pending").length;

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-hidden">
        {/* Toast */}
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
              onSave={handleSaveGrades}
              isSaving={isSaving}
              appealsCount={pendingAppealsCount}
              onOpenAppeals={() => setIsAppealsOpen(true)}
            />

            {/* Stats Cards */}
            <GradeStatsCards
              averages={averages}
              totalStudents={filteredStudents.length}
            />

            {/* Filter Tabs & Search */}
            <GradeFilterTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredCount={filteredStudents.length}
              totalCount={filteredStudents.length}
            />

            {/* Grade Table */}
            <GradeTable
              students={filteredStudents}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onScoreChange={handleScoreChange}
              calculateFinalGrade={calculateFinalGrade}
            />
          </main>
        </div>

        {/* Modal Koreksi Nilai Mahasiswa */}
        <GradeAppealsModal
          isOpen={isAppealsOpen}
          onClose={() => setIsAppealsOpen(false)}
          appeals={appeals}
          onUpdateStatus={handleUpdateAppealStatus}
        />
      </div>
    </AuthGuard>
  );
}
