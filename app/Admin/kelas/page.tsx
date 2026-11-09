"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AuthGuard from "@/components/shared/AuthGuard";
import { CheckCircle2 } from "lucide-react";
import { useAdminClasses } from "@/hooks/useAdminClasses";
import {
  ClassHeader,
  ClassSearchBar,
  ClassTable,
  CreateEditClassModal,
  DeleteClassModal,
  ManageClassStudentsModal,
} from "./components";

export default function AdminKelasPage() {
  const {
    classes,
    filteredClasses,
    lecturers,
    masterStudents,
    searchQuery,
    setSearchQuery,
    selectedProdi,
    setSelectedProdi,
    selectedSemester,
    setSelectedSemester,
    isLoading,
    isSubmitting,
    toastMsg,
    toastType,
    showToast,
    showCreateModal,
    setShowCreateModal,
    editingClass,
    openCreateModal,
    openEditModal,
    handleSaveClass,
    deletingClassId,
    setDeletingClassId,
    handleDeleteClass,
    managingClass,
    setManagingClass,
    classStudents,
    loadingStudents,
    newNim,
    setNewNim,
    newName,
    setNewName,
    selectedMasterStudentId,
    setSelectedMasterStudentId,
    formData,
    setFormData,
    fetchCampusClasses,
    openManageStudents,
    handleEnrollStudent,
    handleUnenrollStudent,
  } = useAdminClasses();

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        <AdminSidebar currentPath="/admin/kelas" />

        <main className="flex-1 min-w-0 flex flex-col">
          <AdminHeader
            breadcrumbs={["Portal", "Sistem Akademik", "Manajemen Data Kelas"]}
          />

          <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header Bar */}
            <ClassHeader
              isLoading={isLoading}
              onRefresh={fetchCampusClasses}
              onOpenCreateModal={openCreateModal}
            />

            {/* Notification Toast */}
            {showToast && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
                  toastType === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{toastMsg}</span>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <ClassSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedProdi={selectedProdi}
              onProdiChange={setSelectedProdi}
              selectedSemester={selectedSemester}
              onSemesterChange={setSelectedSemester}
              filteredCount={filteredClasses.length}
              totalCount={classes.length}
            />

            {/* Class Table */}
            <ClassTable
              classes={filteredClasses}
              isLoading={isLoading}
              onOpenCreateModal={openCreateModal}
              onOpenManageStudents={openManageStudents}
              onOpenEditModal={openEditModal}
              onOpenDeleteConfirm={(id) => setDeletingClassId(id)}
            />
          </div>
        </main>

        {/* Modal Tambah / Edit Kelas */}
        <CreateEditClassModal
          isOpen={showCreateModal || !!editingClass}
          editingClass={editingClass}
          formData={formData}
          setFormData={setFormData}
          lecturers={lecturers}
          isSubmitting={isSubmitting}
          onClose={() => {
            setShowCreateModal(false);
          }}
          onSubmit={handleSaveClass}
        />

        {/* Modal Konfirmasi Hapus Kelas */}
        <DeleteClassModal
          deletingClassId={deletingClassId}
          onClose={() => setDeletingClassId(null)}
          onConfirm={handleDeleteClass}
        />

        {/* Modal Kelola Mahasiswa Kelas */}
        <ManageClassStudentsModal
          managingClass={managingClass}
          masterStudents={masterStudents}
          classStudents={classStudents}
          loadingStudents={loadingStudents}
          selectedMasterStudentId={selectedMasterStudentId}
          setSelectedMasterStudentId={setSelectedMasterStudentId}
          newNim={newNim}
          setNewNim={setNewNim}
          newName={newName}
          setNewName={setNewName}
          onEnroll={handleEnrollStudent}
          onUnenroll={handleUnenrollStudent}
          onClose={() => setManagingClass(null)}
        />
      </div>
    </AuthGuard>
  );
}
