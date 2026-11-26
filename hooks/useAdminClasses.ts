"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import {
  CampusClassData,
  LecturerOption,
  ClassStudentItem,
  ClassFormData,
  CLASS_PRODI_OPTIONS,
  normalizeClassProdi,
} from "@/types/class";

const INITIAL_FORM: ClassFormData = {
  code: "",
  title: "",
  sks: 3,
  prodi: "S1 Teknik Informatika",
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
      if (res.classes) {
        const formatted = res.classes.map((c: any) => {
          const prefix = c.lecturer_title_prefix ? `${c.lecturer_title_prefix.trim()} ` : "";
          const suffix = c.lecturer_title_suffix ? `, ${c.lecturer_title_suffix.trim()}` : "";
          const computedFullName = `${prefix}${c.lecturer_name || ""}${suffix}`.trim() || c.lecturer_name || "";
          return {
            ...c,
            lecturerFullName: c.lecturerFullName || computedFullName,
          };
        });
        setClasses(formatted);
      }
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

  const [pendingManageId, setPendingManageId] = useState<number | null>(null);

  useEffect(() => {
    fetchCampusClasses();
    fetchLecturersAndStudents();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      const prodiParam = params.get("prodi");
      const manageParam = params.get("manage");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
      if (prodiParam) {
        setSelectedProdi(normalizeClassProdi(prodiParam) || prodiParam);
      }
      if (manageParam && !isNaN(Number(manageParam))) {
        setPendingManageId(Number(manageParam));
      }
    }
  }, []);

  useEffect(() => {
    if (pendingManageId && classes.length > 0) {
      const target = classes.find((c) => c.id === pendingManageId);
      if (target) {
        openManageStudents(target);
      }
      setPendingManageId(null);
    }
  }, [pendingManageId, classes]);

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
      prodi: normalizeClassProdi(c.prodi) || "S1 Teknik Informatika",
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
      setEditingClass(null);
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

    const maxCapacity = Number(managingClass.capacity) || 0;
    if (maxCapacity > 0 && classStudents.length >= maxCapacity) {
      notify(
        `Kapasitas kelas sudah penuh (${classStudents.length}/${maxCapacity} mahasiswa).`,
        "error"
      );
      return;
    }

    try {
      const isAddingNew = Boolean(!selectedMasterStudentId && newNim && newName);
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
            prodi: normalizeClassProdi(managingClass.prodi) || managingClass.prodi,
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
      if (isAddingNew) {
        fetchLecturersAndStudents();
      }
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

  const handleFillMinimumStudents = async (classId: number) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/admin/classes/${classId}/fill-minimum`, {
        method: "POST",
      });
      notify(res.message || "Kelas berhasil diisi minimal 30 mahasiswa.");
      if (managingClass && managingClass.id === classId) {
        const stuRes = await apiFetch(`/admin/classes/${classId}/students`);
        if (stuRes.students) setClassStudents(stuRes.students);
      }
      fetchCampusClasses();
      fetchLecturersAndStudents();
    } catch (err: any) {
      notify("Gagal mengisi minimal 30 mahasiswa: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Opsi Program Studi Dinamis & Terstandarisasi (mencakup semua prodi yang terdaftar di kelas & mahasiswa)
  const prodiOptions = Array.from(
    new Set([
      "Semua Prodi",
      ...CLASS_PRODI_OPTIONS.filter((p) => p !== "Semua Prodi"),
      ...classes.map((c) => normalizeClassProdi(c.prodi)).filter(Boolean),
      ...masterStudents.map((s) => normalizeClassProdi(s.prodi)).filter(Boolean),
    ])
  );

  // Filter kelas kampus
  const filteredClasses = classes.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.lecturerFullName && c.lecturerFullName.toLowerCase().includes(q)) ||
      (c.lecturer_name && c.lecturer_name.toLowerCase().includes(q)) ||
      (c.lecturer_nidn && c.lecturer_nidn.toLowerCase().includes(q));

    const normSelected = normalizeClassProdi(selectedProdi).toLowerCase();
    const normClassProdi = normalizeClassProdi(c.prodi).toLowerCase();

    const matchesProdi =
      selectedProdi === "Semua Prodi" ||
      normClassProdi === normSelected ||
      (normSelected === "s1 teknik informatika" &&
        (normClassProdi === "s1 informatika" || normClassProdi === "informatika")) ||
      (normClassProdi === "s1 teknik informatika" &&
        (normSelected === "s1 informatika" || normSelected === "informatika")) ||
      (normSelected === "s1 manajemen informatika" &&
        normClassProdi === "d3 manajemen informatika") ||
      (normClassProdi === "s1 manajemen informatika" &&
        normSelected === "d3 manajemen informatika");

    const matchesSemester =
      selectedSemester === "Semua" || String(c.semester) === selectedSemester;

    return matchesSearch && matchesProdi && matchesSemester;
  });

  return {
    classes,
    filteredClasses,
    prodiOptions,
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
    setEditingClass,
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
    handleFillMinimumStudents,
  };
}

