"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiFetch } from "@/lib/api";
import {
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  RefreshCw,
  X,
  UserPlus,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface CampusClassData {
  id: number;
  code: string;
  title: string;
  sks: number;
  prodi: string;
  semester: number;
  academic_year: string;
  capacity: number;
  schedule: string;
  room: string;
  lecturer_id: number;
  lecturer_name: string;
  lecturer_nidn: string;
  lecturerFullName: string;
  enrolled_count: number;
}

interface LecturerOption {
  id: number;
  nidn: string;
  name: string;
  fullName: string;
}

interface StudentItem {
  id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
  enrollment_id?: number;
}

const PRODI_OPTIONS = [
  "Semua Prodi",
  "S1 Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "D3 Manajemen Informatika",
];

export default function AdminKelasPage() {
  const [classes, setClasses] = useState<CampusClassData[]>([]);
  const [lecturers, setLecturers] = useState<LecturerOption[]>([]);
  const [masterStudents, setMasterStudents] = useState<StudentItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("Semua Prodi");
  const [selectedSemester, setSelectedSemester] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState<CampusClassData | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null);

  // Student management modal state
  const [managingClass, setManagingClass] = useState<CampusClassData | null>(null);
  const [classStudents, setClassStudents] = useState<StudentItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [newNim, setNewNim] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedMasterStudentId, setSelectedMasterStudentId] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    sks: 3,
    prodi: "S1 Informatika",
    semester: 1,
    academic_year: "2024/2025 Ganjil",
    capacity: 40,
    schedule: "Senin, 08:00 - 10:30 WIB",
    room: "Lab Komputer 1",
    lecturer_id: "",
  });

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
  }, []);

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData({
      code: "",
      title: "",
      sks: 3,
      prodi: "S1 Informatika",
      semester: 1,
      academic_year: "2024/2025 Ganjil",
      capacity: 40,
      schedule: "Senin, 08:00 - 10:30 WIB",
      room: "Lab Komputer 1",
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
      schedule: c.schedule,
      room: c.room,
      lecturer_id: String(c.lecturer_id),
    });
    setShowCreateModal(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.title || !formData.lecturer_id) {
      notify("Mohon lengkapi kode kelas, nama mata kuliah, dan dosen pengampu.");
      return;
    }

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
        notify("Kelas baru berhasil ditambahkan.");
      }
      setShowCreateModal(false);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal menyimpan kelas: " + err.message);
    }
  };

  const handleDeleteClass = async (id: number) => {
    try {
      await apiFetch(`/admin/classes/${id}`, { method: "DELETE" });
      notify("Kelas berhasil dihapus.");
      setDeletingClassId(null);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal menghapus kelas: " + err.message);
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
      notify("Gagal memuat mahasiswa kelas: " + err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
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
        notify("Pilih mahasiswa dari daftar atau isi NIM dan Nama Mahasiswa.");
        return;
      }

      notify("Mahasiswa berhasil didaftarkan ke kelas.");
      setNewNim("");
      setNewName("");
      setSelectedMasterStudentId("");

      // Reload students
      const res = await apiFetch(`/admin/classes/${managingClass.id}/students`);
      if (res.students) setClassStudents(res.students);
      fetchCampusClasses();
    } catch (err: any) {
      notify("Gagal mendaftarkan mahasiswa: " + err.message);
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
      notify("Gagal menghapus mahasiswa: " + err.message);
    }
  };

  // Filter kelas kampus
  const filteredClasses = classes.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.lecturerFullName.toLowerCase().includes(q) ||
      c.lecturer_nidn.toLowerCase().includes(q);

    const matchesProdi =
      selectedProdi === "Semua Prodi" || c.prodi.toLowerCase() === selectedProdi.toLowerCase();

    const matchesSemester =
      selectedSemester === "Semua" || String(c.semester) === selectedSemester;

    return matchesSearch && matchesProdi && matchesSemester;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <AdminSidebar currentPath="/Admin/kelas" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Manajemen Data Kelas"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Manajemen Data Kelas Perkuliahan</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Kelola rombongan belajar, penugasan dosen pengampu, dan mahasiswa terdaftar lintas program studi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kelas Baru</span>
              </button>

              <button
                type="button"
                onClick={fetchCampusClasses}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari mata kuliah, kode, atau dosen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Filter Prodi */}
              <div className="w-full sm:w-auto">
                <select
                  value={selectedProdi}
                  onChange={(e) => setSelectedProdi(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                >
                  {PRODI_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Semester */}
              <div className="w-full sm:w-auto">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                >
                  <option value="Semua">Semua Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={String(s)}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{filteredClasses.length}</span> dari{" "}
              <span className="font-bold text-slate-800">{classes.length}</span> kelas aktif
            </div>
          </div>

          {/* Classes Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Kode & Mata Kuliah</th>
                    <th className="py-3 px-4">Dosen Pengampu</th>
                    <th className="py-3 px-4">Program Studi</th>
                    <th className="py-3 px-4">Jadwal & Ruang</th>
                    <th className="py-3 px-4 text-center">Kapasitas</th>
                    <th className="py-3 px-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                        <span>Memuat data kelas...</span>
                      </td>
                    </tr>
                  ) : filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                        Tidak ada kelas perkuliahan yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((c) => {
                      const capacity = c.capacity || 40;
                      const enrolled = c.enrolled_count || 0;
                      const percent = Math.min(Math.round((enrolled / capacity) * 100), 100);

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Kode & Mata Kuliah */}
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                              <div className="flex items-center gap-2 mt-1 text-[10px]">
                                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                                  {c.code}
                                </span>
                                <span className="text-slate-500 font-semibold">{c.sks} SKS</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">Sem. {c.semester}</span>
                              </div>
                            </div>
                          </td>

                          {/* Dosen Pengampu */}
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-semibold text-slate-800 text-xs">{c.lecturerFullName}</p>
                              <p className="text-[10px] text-slate-400">NIDN: {c.lecturer_nidn}</p>
                            </div>
                          </td>

                          {/* Program Studi */}
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-700 text-xs">{c.prodi}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.academic_year || "2024/2025 Ganjil"}</p>
                          </td>

                          {/* Jadwal & Ruangan */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5 text-xs">
                              <p className="text-slate-700 font-medium">{c.schedule || "Belum diatur"}</p>
                              <p className="text-[10px] text-slate-400">{c.room || "Ruang Kuliah"}</p>
                            </div>
                          </td>

                          {/* Kapasitas */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="max-w-[120px] mx-auto space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-semibold">
                                <span className="text-indigo-600 font-bold">{enrolled} Mhs</span>
                                <span className="text-slate-400">Kuota {capacity}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Aksi Manajemen */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openManageStudents(c)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition flex items-center gap-1"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Mahasiswa</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditModal(c)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                                title="Edit Kelas"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeletingClassId(c.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                                title="Hapus Kelas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL TAMBAH / EDIT KELAS */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingClass ? "Edit Data Kelas" : "Tambah Kelas Perkuliahan Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TIF-201"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bobot SKS
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formData.sks}
                    onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Mata Kuliah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Algoritma & Pemrograman"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dosen Pengampu Kelas *
                </label>
                <select
                  required
                  value={formData.lecturer_id}
                  onChange={(e) => setFormData({ ...formData, lecturer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                >
                  <option value="">Pilih Dosen Pengampu...</option>
                  {lecturers.map((lec) => (
                    <option key={lec.id} value={lec.id}>
                      {lec.fullName || lec.name} (NIDN: {lec.nidn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Program Studi
                  </label>
                  <select
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                  >
                    {PRODI_OPTIONS.filter((p) => p !== "Semua Prodi").map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jadwal Pertemuan
                  </label>
                  <input
                    type="text"
                    placeholder="Senin, 08:00 - 10:30 WIB"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruangan
                  </label>
                  <input
                    type="text"
                    placeholder="Lab Komputer 1"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kapasitas Maksimal Mahasiswa
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition"
                >
                  {editingClass ? "Simpan Perubahan" : "Buat Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KELOLA MAHASISWA KELAS */}
      {managingClass && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Kelola Mahasiswa Kelas: {managingClass.title}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Kode: <strong className="text-indigo-600">{managingClass.code}</strong> • Dosen: {managingClass.lecturerFullName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingClass(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Tambah Mahasiswa ke Kelas */}
            <form onSubmit={handleEnrollStudent} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Daftarkan Mahasiswa ke Kelas Ini</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Pilih dari Master Mahasiswa</label>
                  <select
                    value={selectedMasterStudentId}
                    onChange={(e) => {
                      setSelectedMasterStudentId(e.target.value);
                      if (e.target.value) {
                        setNewNim("");
                        setNewName("");
                      }
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="">Pilih Mahasiswa Terdaftar...</option>
                    {masterStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nim} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Atau Input NIM Baru</label>
                    <input
                      type="text"
                      placeholder="NIM"
                      value={newNim}
                      onChange={(e) => {
                        setNewNim(e.target.value);
                        setSelectedMasterStudentId("");
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Nama"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        setSelectedMasterStudentId("");
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftarkan Mahasiswa</span>
                </button>
              </div>
            </form>

            {/* List Mahasiswa Terdaftar */}
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">NIM</th>
                    <th className="py-2.5 px-3">Nama Mahasiswa</th>
                    <th className="py-2.5 px-3">Prodi</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        Memuat mahasiswa...
                      </td>
                    </tr>
                  ) : classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                        Belum ada mahasiswa yang terdaftar di kelas ini.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">{s.nim}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-3 text-slate-500">{s.prodi}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleUnenrollStudent(s.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                            title="Keluarkan dari kelas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs">
              <span>Total: {classStudents.length} Mahasiswa Terdaftar</span>
              <button
                type="button"
                onClick={() => setManagingClass(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingClassId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Kelas</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini akan menghapus data rombongan belajar dan seluruh nilai terkait.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClassId(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClass(deletingClassId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
