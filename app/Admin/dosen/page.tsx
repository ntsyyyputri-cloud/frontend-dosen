"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { CheckCircle2, X } from "lucide-react";
import { useAdminLecturers } from "@/hooks/useAdminLecturers";
import {
  LecturerHeader,
  LecturerCredentialsNotice,
  LecturerSearchBar,
  LecturerTable,
  CreateLecturerModal,
  DeleteLecturerModal,
  ResetPasswordModal,
} from "@/components/admin/dosen";

export default function AdminDosenPage() {
  const {
    lecturers,
    filteredLecturers,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleDeleteLecturer,
    impersonatingId,
    handleQuickLogin,
    resetTarget,
    setResetTarget,
    resetPasswordVal,
    setResetPasswordVal,
    isResetting,
    handleResetPassword,
    notification,
    setNotification,
    formData,
    setFormData,
    actionState,
    formDispatch,
    isPending,
    getFieldError,
    fetchLecturers,
  } = useAdminLecturers();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      <AdminSidebar currentPath="/Admin/dosen" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Manajemen Akun Dosen"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar Header */}
          <LecturerHeader
            isLoading={isLoading}
            onRefresh={fetchLecturers}
            onOpenCreateModal={() => setIsModalOpen(true)}
          />

          {/* Toast Notification Banner */}
          {notification && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{notification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Info Banner: Kredensial Login Dosen */}
          <LecturerCredentialsNotice />

          {/* Search & Filter Bar */}
          <LecturerSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredCount={filteredLecturers.length}
            totalCount={lecturers.length}
          />

          {/* Lecturers Table */}
          <LecturerTable
            lecturers={filteredLecturers}
            isLoading={isLoading}
            impersonatingId={impersonatingId}
            onQuickLogin={handleQuickLogin}
            onOpenResetPassword={(lec) => {
              setResetTarget(lec);
              setResetPasswordVal("password123");
            }}
            onOpenDeleteConfirm={(lec) => setDeleteTarget(lec)}
          />
        </div>
      </main>

      {/* Modal Tambah Dosen Baru */}
      <CreateLecturerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        actionState={actionState}
        formDispatch={formDispatch}
        isPending={isPending}
        getFieldError={getFieldError}
      />

      {/* Modal Konfirmasi Hapus Dosen */}
      <DeleteLecturerModal
        target={deleteTarget}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteLecturer}
      />

      {/* Modal Reset Kata Sandi Dosen */}
      <ResetPasswordModal
        target={resetTarget}
        resetPasswordVal={resetPasswordVal}
        onPasswordChange={setResetPasswordVal}
        isResetting={isResetting}
        onClose={() => setResetTarget(null)}
        onSubmit={handleResetPassword}
      />
    </div>
  );
}
