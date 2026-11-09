"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AuthGuard from "@/components/shared/AuthGuard";
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

            {/* Search & Filter Bar */}
            <StudentSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedProdi={selectedProdi}
              onProdiChange={setSelectedProdi}
              filteredCount={filteredStudents.length}
              totalCount={students.length}
            />

            {/* Students Table */}
            <StudentTable
              students={filteredStudents}
              isLoading={isLoading}
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
        />

        {/* Modal Konfirmasi Hapus Mahasiswa */}
        <DeleteStudentModal
          target={deleteTarget}
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteStudent}
        />
      </div>
    </AuthGuard>
  );
}
