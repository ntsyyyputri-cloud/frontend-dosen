"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useCetakPDF } from "@/hooks/useCetakPDF";
import {
  CetakPDFControlBar,
  OfficialReportDocument,
} from "./components";

export default function CetakLaporanPDFPage() {
  const {
    lecturer,
    classes,
    selectedClassId,
    grades,
    isLoading,
    handleClassChange,
    handlePrint,
    currentClass,
    lecturerDisplayName,
  } = useCetakPDF();

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        {/* Sidebar (Hidden during print) */}
        <div className="print:hidden">
          <Sidebar currentPath="/dosen/cetakPDF" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header (Hidden during print) */}
          <div className="print:hidden">
            <Header breadcrumbs={["Portal", "Kecerdasan Buatan & Laporan", "Cetak Rekap Nilai PDF"]} />
          </div>

          <main className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Filter selector & Print button */}
            <CetakPDFControlBar
              classes={classes}
              selectedClassId={selectedClassId}
              onClassChange={handleClassChange}
              onPrint={handlePrint}
            />

            {/* Official Report Document Paper */}
            <OfficialReportDocument
              currentClass={currentClass}
              lecturerDisplayName={lecturerDisplayName}
              lecturer={lecturer}
              grades={grades}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
