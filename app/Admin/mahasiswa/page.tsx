"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AuthGuard from "@/components/shared/AuthGuard";
import { SharedResetPasswordModal } from "@/components/admin/ResetPasswordModal";
import { CheckCircle2, X } from "lucide-react";
import { useAdminStudents } from "@/hooks/useAdminStudents";
import {
  StudentHeader,
  StudentSearchBar,
  StudentTable,
  CreateStudentModal,
  DeleteStudentModal,
} from "./components";

export default function AdminMahasiswaPage() {
  const {
    students,
    filteredStudents,
    prodiOptions,
    searchQuery,
    setSearchQuery,
    selectedProdi,
    setSelectedProdi,
    isModalOpen,
    setIsModalOpen,
    isLoading,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    formData,
    setFormData,
    actionState,
    formDispatch,
    isPending,
    getFieldError,
    fetchStudents,
    handleDeleteStudent,
    resetTarget,
    setResetTarget,
    setResetPasswordVal,
    isResetting,
    handleResetPassword,
    notification,
    setNotification,
  } = useAdminStudents();

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        <AdminSidebar currentPath="/admin/mahasiswa" />

        <main className="flex-1 min-w-0 flex flex-col">
          <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Master Data Mahasiswa"]} />

          <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Top Bar */}
            <StudentHeader
              isLoading={isLoading}
              onRefresh={fetchStudents}
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

            {/* Search & Filter Bar */}
            <StudentSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedProdi={selectedProdi}
              onProdiChange={setSelectedProdi}
              filteredCount={filteredStudents.length}
              totalCount={students.length}
              prodiOptions={prodiOptions}
            />

            {/* Students Table */}
            <StudentTable
              students={filteredStudents}
              isLoading={isLoading}
              onOpenResetPassword={(std) => {
                setResetTarget(std);
                setResetPasswordVal("");
              }}
              onOpenDeleteConfirm={(std) => setDeleteTarget(std)}
            />
          </div>
        </main>

        {/* Modal Tambah Mahasiswa Baru */}
        <CreateStudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          actionState={actionState}
          formDispatch={formDispatch}
          isPending={isPending}
          getFieldError={getFieldError}
          prodiOptions={prodiOptions}
        />

        {/* Modal Konfirmasi Hapus Mahasiswa */}
        <DeleteStudentModal
          target={deleteTarget}
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteStudent}
        />

        {/* Modal Reset Password Mahasiswa */}
        <SharedResetPasswordModal
          isOpen={Boolean(resetTarget)}
          accountTypeLabel="akun mahasiswa"
          accountInfo={
            resetTarget
              ? {
                  title: resetTarget.name,
                  subtitle: `NIM: ${resetTarget.nim} • ${resetTarget.email}`,
                }
              : null
          }
          isResetting={isResetting}
          onClose={() => {
            setResetTarget(null);
            setResetPasswordVal("");
          }}
          onSubmit={handleResetPassword}
        />
      </div>
    </AuthGuard>
  );
}
