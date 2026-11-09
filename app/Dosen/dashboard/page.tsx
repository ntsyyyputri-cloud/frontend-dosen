"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useLecturerDashboard } from "@/hooks/useLecturerDashboard";
import {
  DashboardHeaderBanner,
  DashboardStatsGrid,
  TodayScheduleCard,
  ObeProgressCard,
  RecentActivityCard,
  FacultyAnnouncementCard,
} from "./components";

export default function LecturerDashboard() {
  const { classes, stats } = useLecturerDashboard();

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        {/* Sidebar */}
        <Sidebar currentPath="/dosen/dashboard" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <Header breadcrumbs={["Portal", "Sistem Akademik", "Dashboard Dosen"]} />

          {/* Main Dashboard Content */}
          <main className="p-6 space-y-6">
            {/* Header Action Banner */}
            <DashboardHeaderBanner />

            {/* Stats Cards Grid */}
            <DashboardStatsGrid stats={stats} />

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Jadwal Mengajar Hari Ini */}
                <TodayScheduleCard classes={classes} />

                {/* Progress Penginputan Nilai OBE */}
                <ObeProgressCard />
              </div>

              {/* Right Column (Sidebar Panels) */}
              <div className="space-y-6">
                {/* Aktivitas Terbaru */}
                <RecentActivityCard />

                {/* Pengumuman Fakultas */}
                <FacultyAnnouncementCard />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
            <p>© 2024–2025 Lembaga Layanan Pendidikan Tinggi (LLDIKTI) • Gradia</p>
            <div className="text-emerald-600 font-medium">
              Sistem Aktif & Terlindungi
            </div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
