"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2 } from "lucide-react";
import { useLecturerProfile } from "@/hooks/useLecturerProfile";
import {
  ProfileHeroBanner,
  ProfileNavTabs,
  PersonalInfoTab,
  AcademicTeachingTab,
  SettingsNotifTab,
} from "./components";

export default function KelolaProfilDosenPage() {
  const {
    activeTab,
    setActiveTab,
    formData,
    handleInputChange,
    handleSave,
    handleCancel,
    showToast,
    toastMsg,
    isSaving,
  } = useLecturerProfile();

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
        <Sidebar currentPath="/dosen/profil" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header breadcrumbs={["Portal", "Pengaturan Akun", "Kelola Profil"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Top Identity Hero Banner */}
            <ProfileHeroBanner formData={formData} />

            {/* Navigation Tabs */}
            <ProfileNavTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab 1: Personal Info */}
            {activeTab === "Informasi Pribadi & Identitas" && (
              <PersonalInfoTab
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            )}

            {/* Tab 2: Academic Teaching */}
            {activeTab === "Beban Mengajar & Akademik" && (
              <AcademicTeachingTab />
            )}

            {/* Tab 3: Settings & Notifications */}
            {activeTab === "Pengaturan & Notifikasi" && (
              <SettingsNotifTab
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
              />
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
