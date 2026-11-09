"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2 } from "lucide-react";
import { useInputNilai } from "@/hooks/useInputNilai";
import {
  GradeClassHeader,
  GradeStatsCards,
  GradeFilterTabs,
  GradeTable,
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
      </div>
    </AuthGuard>
  );
}
