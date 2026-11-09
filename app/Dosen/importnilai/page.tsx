"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2 } from "lucide-react";
import { useImportNilai } from "@/hooks/useImportNilai";
import {
  ImportStepIndicator,
  StepUploadFile,
  StepPreviewMapping,
  StepAIGenerate,
  StepFinishLock,
} from "./components";

export default function ImportNilaiExcel() {
  const {
    currentStep,
    classes,
    selectedClassId,
    setSelectedClassId,
    uploadedFile,
    previewData,
    isProcessingAI,
    showToast,
    toastMsg,
    isUploading,
    aiClassSummary,
    handleStepChange,
    handleDownloadTemplate,
    handleFileChange,
    handleProcessAI,
    handleLockGrades,
  } = useImportNilai();

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        {/* Toast */}
        {showToast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Sidebar */}
        <Sidebar currentPath="/dosen/importnilai" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header breadcrumbs={["Portal", "Penilaian & Evaluasi", "Import Nilai & Generate AI"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Import Rekap Nilai & Analisis AI
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Unggah file Excel/CSV nilai mahasiswa dan dapatkan kalkulasi OBE serta analisis AI secara instan.
              </p>
            </div>

            {/* Step Wizard Indicator */}
            <ImportStepIndicator
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />

            {/* Step 1: Upload File */}
            {currentStep === 1 && (
              <StepUploadFile
                classes={classes}
                selectedClassId={selectedClassId}
                onClassChange={setSelectedClassId}
                onDownloadTemplate={handleDownloadTemplate}
                onFileChange={handleFileChange}
                isUploading={isUploading}
              />
            )}

            {/* Step 2: Mapping & Preview Data */}
            {currentStep === 2 && (
              <StepPreviewMapping
                uploadedFile={uploadedFile}
                previewData={previewData}
                onBack={() => handleStepChange(1)}
                onProceed={handleProcessAI}
                isProcessing={isProcessingAI}
              />
            )}

            {/* Step 3: AI Generate & Review */}
            {currentStep === 3 && (
              <StepAIGenerate
                previewData={previewData}
                summary={aiClassSummary}
                onBack={() => handleStepChange(2)}
                onLock={handleLockGrades}
              />
            )}

            {/* Step 4: Finish Lock */}
            {currentStep === 4 && <StepFinishLock />}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
