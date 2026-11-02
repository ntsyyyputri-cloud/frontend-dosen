"use client";

import React, { useEffect, useState, useActionState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiFetch } from "@/lib/api";
import { createStudentByAdminAction, deleteStudentByAdminAction } from "@/app/actions/admin-actions";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Mail,
  GraduationCap,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from "lucide-react";

interface StudentData {
  id: number;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: string;
  enrolled_classes_count: number;
}

const PRODI_OPTIONS = [
  "Semua Prodi",
  "S1 Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "D3 Manajemen Informatika",
];

export default function AdminMahasiswaPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("Semua Prodi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<StudentData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    email: "",
    prodi: "S1 Informatika",
    status: "Aktif",
  });

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

  // Efek ketika mutasi berhasil
  useEffect(() => {
    if (actionState?.data?.success && actionState.data.newStudent) {
      setStudents((prev) => [actionState.data!.newStudent as any, ...prev]);
      setIsModalOpen(false);
      setFormData({
        nim: "",
        name: "",
        email: "",
        prodi: "S1 Informatika",
        status: "Aktif",
      });
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

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      <AdminSidebar currentPath="/Admin/mahasiswa" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Master Data Mahasiswa"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Master Data Mahasiswa Kampus</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Data induk mahasiswa seluruh program studi, status keaktifan akademik, dan kepesertaan kelas.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={fetchStudents}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-all"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Mahasiswa</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan NIM, nama, atau email..."
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
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{filteredStudents.length}</span> dari{" "}
              <span className="font-bold text-slate-800">{students.length}</span> mahasiswa
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">NIM & Mahasiswa</th>
                    <th className="py-3 px-4">Program Studi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Kelas Terdaftar</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                        <span>Memuat data mahasiswa...</span>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        Tidak ada data mahasiswa yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {std.name[0] || "M"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{std.name}</p>
                              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                NIM: {std.nim} • {std.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 text-xs">{std.prodi}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              std.status === "Aktif"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {std.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            <span>{std.enrolled_classes_count || 0} Mata Kuliah</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(std)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            title="Hapus Data Mahasiswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================
          MODAL TAMBAH MAHASISWA BARU (SERVER ACTION + ZOD)
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <span>Tambah Data Mahasiswa Baru</span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Input data mahasiswa ke master akademik kampus
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form action={formDispatch} className="space-y-4 pt-4">
              {actionState?.serverError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionState.serverError}</span>
                </div>
              )}

              {/* NIM & Nama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIM Mahasiswa *
                  </label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    placeholder="Contoh: 2110511001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    required
                  />
                  {getFieldError("nim") && (
                    <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                      ⚠️ {getFieldError("nim")}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Aditia Pratama"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    required
                  />
                  {getFieldError("name") && (
                    <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                      ⚠️ {getFieldError("name")}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Mahasiswa *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mahasiswa@student.univ.ac.id"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  required
                />
                {getFieldError("email") && (
                  <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                    ⚠️ {getFieldError("email")}
                  </span>
                )}
              </div>

              {/* Prodi & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Program Studi *
                  </label>
                  <select
                    name="prodi"
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  >
                    <option value="S1 Informatika">S1 Informatika</option>
                    <option value="S1 Sistem Informasi">S1 Sistem Informasi</option>
                    <option value="S1 Teknologi Informasi">S1 Teknologi Informasi</option>
                    <option value="D3 Manajemen Informatika">D3 Manajemen Informatika</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Akademik
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold flex items-center gap-2 shadow-sm"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simpan Mahasiswa</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL KONFIRMASI HAPUS MAHASISWA
      ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Hapus Data Mahasiswa</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus data mahasiswa{" "}
                <span className="font-bold text-slate-800">{deleteTarget.name}</span> ({deleteTarget.nim})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteStudent}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm disabled:bg-rose-300"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
