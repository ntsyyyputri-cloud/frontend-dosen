"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useLecturerSecurity } from "@/hooks/useLecturerSecurity";
import {
  ChangePasswordCard,
  TwoFactorCard,
} from "./components";

export default function KeamananAkunPage() {
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    twoFactor,
    setTwoFactor,
    toastMsg,
    isSubmitting,
    isError,
    handlePasswordSubmit,
  } = useLecturerSecurity();

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentPath="/dosen/keamanan" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header breadcrumbs={["Portal", "Pengaturan Akun", "Keamanan & Akun"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Keamanan & Akun Dosen</h1>
              <p className="text-slate-500 text-xs mt-1">
                Kelola kata sandi, otentikasi dua langkah, dan proteksi akun akademik Anda.
              </p>
            </div>

            {/* Notification Toast Alert */}
            {toastMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  isError
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Form Ganti Password */}
            <ChangePasswordCard
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isSubmitting={isSubmitting}
              onSubmit={handlePasswordSubmit}
            />

            {/* Otentikasi Dua Langkah (2FA) */}
            <TwoFactorCard
              twoFactor={twoFactor}
              onToggle={setTwoFactor}
            />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
