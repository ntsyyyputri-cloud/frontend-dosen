"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AuthGuard from "@/components/shared/AuthGuard";
import { CheckCircle2, X } from "lucide-react";
import { useAdminLecturers } from "@/hooks/useAdminLecturers";
import {
  LecturerHeader,
  LecturerSearchBar,
  LecturerTable,
  CreateLecturerModal,
  DeleteLecturerModal,
  ResetPasswordModal,
} from "./components";

export default function AdminDosenPage() {
  const router = useRouter();
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
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        <AdminSidebar currentPath="/admin/dosen" />

        <main className="flex-1 min-w-0 flex flex-col">
          <AdminHeader
            breadcrumbs={["Portal", "Sistem Akademik", "Manajemen Akun Dosen"]}
          />

          <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header Bar */}
            <LecturerHeader
              isLoading={isLoading}
              onRefresh={fetchLecturers}
              onOpenCreateModal={() => setIsModalOpen(true)}
            />

            {/* Notification Alert */}
            {notification && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
                  notification.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{notification.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="hover:opacity-75 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search Input Bar */}
            <LecturerSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredCount={filteredLecturers.length}
              totalCount={lecturers.length}
            />

            {/* Lecturer Table */}
            <LecturerTable
              lecturers={filteredLecturers}
              isLoading={isLoading}
              onOpenResetPassword={(lec) => {
                setResetTarget(lec);
                setResetPasswordVal("password123");
              }}
              onOpenDeleteConfirm={(lec) => setDeleteTarget(lec)}
              onViewClasses={(lec) => {
                router.push(`/admin/kelas?search=${encodeURIComponent(lec.name)}`);
              }}
            />
          </div>
        </main>

        {/* Modal Tambah Dosen */}
        <CreateLecturerModal
          isOpen={isModalOpen}
          isPending={isPending}
          actionState={actionState}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setIsModalOpen(false)}
          formDispatch={formDispatch}
          getFieldError={getFieldError}
        />

        {/* Modal Konfirmasi Hapus Dosen */}
        <DeleteLecturerModal
          target={deleteTarget}
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteLecturer}
        />

        {/* Modal Reset Password Dosen */}
        <ResetPasswordModal
          target={resetTarget}
          resetPasswordVal={resetPasswordVal}
          onPasswordChange={setResetPasswordVal}
          isResetting={isResetting}
          onClose={() => setResetTarget(null)}
          onSubmit={handleResetPassword}
        />
      </div>
    </AuthGuard>
  );
}
