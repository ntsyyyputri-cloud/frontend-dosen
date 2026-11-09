"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import {
  CampusClassData,
  LecturerOption,
  ClassStudentItem,
  ClassFormData,
} from "@/types/class";

const INITIAL_FORM: ClassFormData = {
  code: "",
  title: "",
  sks: 3,
  prodi: "S1 Informatika",
  semester: 1,
  academic_year: "2024/2025 Ganjil",
  capacity: 40,
  schedule: "",
  room: "",
  lecturer_id: "",
};

export function useAdminClasses() {
  const [classes, setClasses] = useState<CampusClassData[]>([]);
  const [lecturers, setLecturers] = useState<LecturerOption[]>([]);
  const [masterStudents, setMasterStudents] = useState<ClassStudentItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("Semua Prodi");
  const [selectedSemester, setSelectedSemester] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState<CampusClassData | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null);

  // Student management modal state
  const [managingClass, setManagingClass] = useState<CampusClassData | null>(null);
  const [classStudents, setClassStudents] = useState<ClassStudentItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [newNim, setNewNim] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedMasterStudentId, setSelectedMasterStudentId] = useState("");

  // Form state
  const [formData, setFormData] = useState<ClassFormData>(INITIAL_FORM);

  const fetchCampusClasses = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/admin/classes");
      if (res.classes) setClasses(res.classes);
    } catch (err: any) {
      console.warn("Gagal mengambil data kelas kampus:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLecturersAndStudents = async () => {
    try {
      const lecRes = await apiFetch("/admin/lecturers");
      if (lecRes.lecturers) setLecturers(lecRes.lecturers);

      const stuRes = await apiFetch("/admin/students");
      if (stuRes.students) setMasterStudents(stuRes.students);
    } catch (e) {}
  };

  useEffect(() => {
    fetchCampusClasses();
    fetchLecturersAndStudents();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData({
      ...INITIAL_FORM,
      lecturer_id: lecturers[0]?.id ? String(lecturers[0].id) : "",
    });
    setShowCreateModal(true);
  };

  const openEditModal = (c: CampusClassData) => {
    setEditingClass(c);
    setFormData({
      code: c.code,
      title: c.title,
      sks: c.sks,
      prodi: c.prodi,
      semester: c.semester,
      academic_year: c.academic_year || "2024/2025 Ganjil",
      capacity: c.capacity,
      schedule: c.schedule || "",
      room: c.room || "",
      lecturer_id: String(c.lecturer_id),
    });
    setShowCreateModal(true);
  };

  const handleSaveClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim() || !formData.lecturer_id) {
      notify("Mohon lengkapi kode kelas, nama mata kuliah, dan pilih dosen pengampu.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingClass) {
        await apiFetch(`/admin/classes/${editingClass.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        notify("Data kelas berhasil diperbarui.");
      } else {
        await apiFetch("/admin/classes", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        notify("Kelas baru berhasil dibuat dan ditambahkan!");
      }
      setShowCreateModal(false);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal menyimpan kelas: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    try {
      await apiFetch(`/admin/classes/${id}`, { method: "DELETE" });
      notify("Kelas berhasil dihapus.");
      setDeletingClassId(null);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal menghapus kelas: " + err.message, "error");
    }
  };

  // Student management handlers
  const openManageStudents = async (c: CampusClassData) => {
    setManagingClass(c);
    setLoadingStudents(true);
    setNewNim("");
    setNewName("");
    setSelectedMasterStudentId("");

    try {
      const res = await apiFetch(`/admin/classes/${c.id}/students`);
      if (res.students) setClassStudents(res.students);
    } catch (err: any) {
      notify("Gagal memuat mahasiswa kelas: " + err.message, "error");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEnrollStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!managingClass) return;

    try {
      if (selectedMasterStudentId) {
        await apiFetch(`/admin/classes/${managingClass.id}/students`, {
          method: "POST",
          body: JSON.stringify({ studentId: Number(selectedMasterStudentId) }),
        });
      } else if (newNim && newName) {
        await apiFetch(`/admin/classes/${managingClass.id}/students`, {
          method: "POST",
          body: JSON.stringify({
            nim: newNim,
            name: newName,
            prodi: managingClass.prodi,
          }),
        });
      } else {
        notify("Pilih mahasiswa dari daftar atau isi NIM dan Nama Mahasiswa.", "error");
        return;
      }

      notify("Mahasiswa berhasil didaftarkan ke kelas.");
      setNewNim("");
      setNewName("");
      setSelectedMasterStudentId("");

      const res = await apiFetch(`/admin/classes/${managingClass.id}/students`);
      if (res.students) setClassStudents(res.students);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal mendaftarkan mahasiswa: " + err.message, "error");
    }
  };

  const handleUnenrollStudent = async (studentId: number) => {
    if (!managingClass) return;
    try {
      await apiFetch(`/admin/classes/${managingClass.id}/students/${studentId}`, {
        method: "DELETE",
      });
      notify("Mahasiswa berhasil dikeluarkan dari kelas.");
      const res = await apiFetch(`/admin/classes/${managingClass.id}/students`);
      if (res.students) setClassStudents(res.students);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal menghapus mahasiswa: " + err.message, "error");
    }
  };

  // Filter kelas kampus
  const filteredClasses = classes.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.lecturerFullName && c.lecturerFullName.toLowerCase().includes(q)) ||
      (c.lecturer_nidn && c.lecturer_nidn.toLowerCase().includes(q));

    const matchesProdi =
      selectedProdi === "Semua Prodi" || c.prodi.toLowerCase() === selectedProdi.toLowerCase();

    const matchesSemester =
      selectedSemester === "Semua" || String(c.semester) === selectedSemester;

    return matchesSearch && matchesProdi && matchesSemester;
  });

  return {
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
  };
}

