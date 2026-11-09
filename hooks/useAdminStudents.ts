"use client";

import { useEffect, useState, useActionState } from "react";
import { apiFetch } from "@/lib/api";
import { createStudentByAdminAction } from "@/app/actions/admin-actions";
import { StudentData, StudentFormData } from "@/types/student";

const INITIAL_FORM: StudentFormData = {
  nim: "",
  name: "",
  email: "",
  prodi: "S1 Informatika",
  status: "Aktif",
};

export function useAdminStudents() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("Semua Prodi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<StudentData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>(INITIAL_FORM);

  // Server Action untuk Tambah Mahasiswa
  const [actionState, formDispatch, isPending] = useActionState(createStudentByAdminAction, {});

  // Helper pesan error per field
  const getFieldError = (fieldName: string): string | undefined => {
    if (!actionState?.validationErrors) return undefined;
    const errs = actionState.validationErrors as any;
    if (errs[fieldName]?._errors?.length) return errs[fieldName]._errors[0];
    if (Array.isArray(errs[fieldName]) && errs[fieldName].length > 0) return errs[fieldName][0];
    if (errs.fieldErrors?.[fieldName]?.length) return errs.fieldErrors[fieldName][0];
    return undefined;
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/admin/students");
      if (res.students) setStudents(res.students);
    } catch (err: any) {
      console.warn("Gagal mengambil data mahasiswa:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Efek ketika mutasi server action berhasil
  useEffect(() => {
    if (actionState?.data?.success && actionState.data.newStudent) {
      setStudents((prev) => [actionState.data!.newStudent as any, ...prev]);
      setIsModalOpen(false);
      setFormData(INITIAL_FORM);
    }
  }, [actionState]);

  // Hapus Mahasiswa
  const handleDeleteStudent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/admin/students/${deleteTarget.id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((std) => std.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert("Gagal menghapus mahasiswa: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Mahasiswa
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProdi =
      selectedProdi === "Semua Prodi" || s.prodi.toLowerCase() === selectedProdi.toLowerCase();

    return matchesSearch && matchesProdi;
  });

  return {
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
  };
}

