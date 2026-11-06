"use client";

import { useEffect, useState, useActionState } from "react";
import { apiFetch } from "@/lib/api";
import { createLecturerByAdminAction } from "@/app/actions/admin-actions";
import { LecturerData, LecturerFormData } from "@/types/lecturer";

const INITIAL_FORM_DATA: LecturerFormData = {
  nidn: "",
  name: "",
  titlePrefix: "Dr.",
  titleSuffix: "M.Kom.",
  email: "",
  password: "",
  phone: "",
  officeRoom: "Gedung A Lt. 2",
  consultHours: "Senin - Kamis, 13:00 - 15:00",
};

export function useAdminLecturers() {
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<LecturerData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Login / Impersonate & Reset Password State
  const [impersonatingId, setImpersonatingId] = useState<number | null>(null);
  const [resetTarget, setResetTarget] = useState<LecturerData | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("password123");
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<LecturerFormData>(INITIAL_FORM_DATA);

  // Server Action dengan useActionState untuk Tambah Dosen
  const [actionState, formDispatch, isPending] = useActionState(createLecturerByAdminAction, {});

  // Helper error per field
  const getFieldError = (fieldName: string): string | undefined => {
    if (!actionState?.validationErrors) return undefined;
    const errs = actionState.validationErrors as any;
    if (errs[fieldName]?._errors?.length) return errs[fieldName]._errors[0];
    if (Array.isArray(errs[fieldName]) && errs[fieldName].length > 0) return errs[fieldName][0];
    if (errs.fieldErrors?.[fieldName]?.length) return errs.fieldErrors[fieldName][0];
    return undefined;
  };

  const fetchLecturers = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/admin/lecturers");
      if (res.lecturers) setLecturers(res.lecturers);
    } catch (err: any) {
      console.warn("Gagal mengambil data dosen:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  // Efek jika aksi Server Action berhasil
  useEffect(() => {
    if (actionState?.data?.success && actionState.data.newLecturer) {
      setLecturers((prev) => [actionState.data!.newLecturer as any, ...prev]);
      setIsModalOpen(false);
      setFormData(INITIAL_FORM_DATA);
    }
  }, [actionState]);

  // Aksi Hapus Dosen
  const handleDeleteLecturer = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/admin/lecturers/${deleteTarget.id}`, { method: "DELETE" });
      setLecturers((prev) => prev.filter((lec) => lec.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert("Gagal menghapus dosen: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Login Cepat / Impersonate Akun Dosen
  const handleQuickLogin = async (lec: LecturerData) => {
    setImpersonatingId(lec.id);
    try {
      const res = await apiFetch(`/admin/lecturers/${lec.id}/impersonate`, {
        method: "POST",
      });
      if (res.token) {
        localStorage.setItem("gradia_token", res.token);
        localStorage.setItem("gradia_role", "dosen");
        localStorage.setItem("gradia_lecturer", JSON.stringify(res.lecturer || res.user));
        document.cookie = `gradia_token=${res.token}; path=/; max-age=604800; SameSite=Lax;`;
        document.cookie = `gradia_role=dosen; path=/; max-age=604800; SameSite=Lax;`;
        window.location.href = "/Dosen/dashboard";
      }
    } catch (err: any) {
      alert("Gagal melakukan login cepat: " + err.message);
    } finally {
      setImpersonatingId(null);
    }
  };

  // Reset Kata Sandi Akun Dosen
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    setIsResetting(true);
    try {
      const res = await apiFetch(`/admin/lecturers/${resetTarget.id}/reset-password`, {
        method: "PUT",
        body: JSON.stringify({ password: resetPasswordVal || "password123" }),
      });
      setNotification({
        type: "success",
        message: res.message || `Kata sandi dosen ${resetTarget.name} berhasil direset menjadi "${resetPasswordVal || "password123"}".`,
      });
      setResetTarget(null);
      setResetPasswordVal("password123");
    } catch (err: any) {
      setNotification({
        type: "error",
        message: "Gagal mereset kata sandi: " + err.message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Filter berdasarkan search
  const filteredLecturers = lecturers.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.fullName.toLowerCase().includes(q) ||
      l.nidn.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    );
  });

  return {
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
  };
}

