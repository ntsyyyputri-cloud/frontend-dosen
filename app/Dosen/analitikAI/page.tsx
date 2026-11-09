"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAnalitikAI } from "@/hooks/useAnalitikAI";
import {
  AnalitikHeader,
  AnalitikSummaryCards,
  ComponentAverageCards,
  AiEvaluationCard,
} from "./components";

export default function AnalitikAIPage() {
  const {
    classes,
    selectedClassId,
    loadClassGrades,
    stats,
    generatingAI,
    aiAnalysis,
    handleGenerateAI,
  } = useAnalitikAI();

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentPath="/dosen/analitikAI" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header breadcrumbs={["Portal", "Kecerdasan Buatan & Laporan", "Analitik & AI Feedback"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Header & Class Switcher */}
            <AnalitikHeader
              classes={classes}
              selectedClassId={selectedClassId}
              onClassChange={loadClassGrades}
              onGenerateAI={handleGenerateAI}
              generatingAI={generatingAI}
            />

            {/* Summary Cards */}
            <AnalitikSummaryCards stats={stats} />

            {/* Component Averages */}
            <ComponentAverageCards stats={stats} />

            {/* AI Evaluation Findings */}
            <AiEvaluationCard
              analysis={aiAnalysis}
              onGenerateAI={handleGenerateAI}
              generatingAI={generatingAI}
            />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
