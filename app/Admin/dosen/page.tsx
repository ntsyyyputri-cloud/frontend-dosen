"use client";

import React, { useEffect, useState, useActionState, useOptimistic } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiFetch } from "@/lib/api";
import { createLecturerByAdminAction, deleteLecturerByAdminAction } from "@/app/actions/admin-actions";
import {
  GraduationCap,
  UserPlus,
  Search,
  Trash2,
  Mail,
  Phone,
  Building,
  Clock,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  LogIn,
  ExternalLink,
} from "lucide-react";

interface LecturerData {
  id: number;
  nidn: string;
  name: string;
  fullName: string;
  email: string;
  title_prefix?: string;
  title_suffix?: string;
  phone?: string;
  office_room?: string;
  consult_hours?: string;
  total_classes: number;
  created_at?: string;
}

export default function AdminDosenPage() {
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
  const [formData, setFormData] = useState({
    nidn: "",
    name: "",
    titlePrefix: "Dr.",
    titleSuffix: "M.Kom.",
    email: "",
    password: "",
    phone: "",
    officeRoom: "Gedung A Lt. 2",
    consultHours: "Senin - Kamis, 13:00 - 15:00",
  });

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
      setFormData({
        nidn: "",
        name: "",
        titlePrefix: "Dr.",
        titleSuffix: "M.Kom.",
        email: "",
        password: "",
        phone: "",
        officeRoom: "Gedung A Lt. 2",
        consultHours: "Senin - Kamis, 13:00 - 15:00",
      });
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

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      <AdminSidebar currentPath="/Admin/dosen" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Manajemen Akun Dosen"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Manajemen Akun & Data Dosen</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Kelola hak akses pengajar, penugasan kelas, dan aktivasi akun dosen resmi kampus.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={fetchLecturers}
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
                <span>Tambah Dosen Baru</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {notification && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{notification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Info Banner: Kredensial Login Dosen Siap Digunakan */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">
                  Seluruh data dosen di bawah ini siap digunakan untuk login ke Portal Dosen (/auth/login)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kata sandi bawaan seluruh akun dosen adalah:{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-bold text-indigo-700">
                    password123
                  </code>
                  . Anda juga dapat menggunakan tombol{" "}
                  <strong className="text-indigo-600 font-bold">Login Cepat</strong> di bawah untuk langsung membuka Dashboard Dosen dengan satu klik tanpa memasukkan kata sandi.
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIDN, atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{filteredLecturers.length}</span> dari{" "}
              <span className="font-bold text-slate-800">{lecturers.length}</span> dosen
            </div>
          </div>

          {/* Lecturers Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Dosen & NIDN</th>
                    <th className="py-3 px-4">Kontak & Email</th>
                    <th className="py-3 px-4">Ruang Kantor</th>
                    <th className="py-3 px-4 text-center">Kelas Diampu</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                        <span>Memuat data dosen kampus...</span>
                      </td>
                    </tr>
                  ) : filteredLecturers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        Tidak ada dosen yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredLecturers.map((lec) => (
                      <tr key={lec.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {lec.name[0] || "D"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{lec.fullName}</p>
                              <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                                NIDN: {lec.nidn}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="text-slate-700 font-medium flex items-center gap-1.5 text-xs">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{lec.email}</span>
                            </p>
                            {lec.phone && (
                              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{lec.phone}</span>
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lec.office_room || "-"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                            <Layers className="w-3 h-3" />
                            <span>{lec.total_classes || 0} Kelas</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Tombol Login Cepat ke Dashboard Dosen */}
                            <button
                              type="button"
                              onClick={() => handleQuickLogin(lec)}
                              disabled={impersonatingId === lec.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200/80 transition-all shadow-xs disabled:opacity-50"
                              title="Masuk langsung ke Dashboard Dosen ini"
                            >
                              {impersonatingId === lec.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                              ) : (
                                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                              )}
                              <span>Login Cepat</span>
                            </button>

                            {/* Tombol Reset Kata Sandi */}
                            <button
                              type="button"
                              onClick={() => {
                                setResetTarget(lec);
                                setResetPasswordVal("password123");
                              }}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                              title="Reset Kata Sandi Dosen"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Tombol Hapus Akun Dosen */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(lec)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Hapus Akun Dosen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
          MODAL TAMBAH DOSEN BARU (SERVER ACTION + ZOD VALIDATION)
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <span>Tambah Akun Dosen Baru</span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Input data dosen resmi untuk pembuatan akun dan hak akses portal
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
              {/* Pesan Kesalahan Global dari Server Action */}
              {actionState?.serverError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionState.serverError}</span>
                </div>
              )}

              {/* Baris 1: NIDN & Nama Lengkap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIDN *
                  </label>
                  <input
                    type="text"
                    name="nidn"
                    value={formData.nidn}
                    onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                    placeholder="Contoh: 0412088901"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    required
                  />
                  {getFieldError("nidn") && (
                    <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                      ⚠️ {getFieldError("nidn")}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Dosen *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
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

              {/* Baris 2: Gelar Depan & Gelar Belakang */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gelar Depan
                  </label>
                  <input
                    type="text"
                    name="titlePrefix"
                    value={formData.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                    placeholder="Contoh: Dr. Ir."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gelar Belakang
                  </label>
                  <input
                    type="text"
                    name="titleSuffix"
                    value={formData.titleSuffix}
                    onChange={(e) => setFormData({ ...formData, titleSuffix: e.target.value })}
                    placeholder="Contoh: M.Kom."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Baris 3: Email & Password Sementara */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Resmi Dosen *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dosen@univ.ac.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    required
                  />
                  {getFieldError("email") && (
                    <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                      ⚠️ {getFieldError("email")}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kata Sandi Sementara *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    required
                  />
                  {getFieldError("password") && (
                    <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                      ⚠️ {getFieldError("password")}
                    </span>
                  )}
                </div>
              </div>

              {/* Baris 4: No. Handphone & Ruang Kantor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / Kontak
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ruang Kantor / Dosen
                  </label>
                  <input
                    type="text"
                    name="officeRoom"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    placeholder="Gedung B Lt. 3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  />
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
                      <span>Menyimpan ke Server...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simpan Dosen Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL KONFIRMASI HAPUS DOSEN
      ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Dosen</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun dosen{" "}
                <span className="font-bold text-slate-800">{deleteTarget.fullName}</span>?
                Semua data kelas terkait juga akan dihapus.
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
                onClick={handleDeleteLecturer}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm disabled:bg-rose-300"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
      {/* =========================================================
          MODAL RESET KATA SANDI DOSEN
      ========================================================= */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Kata Sandi</h3>
                  <p className="text-[11px] text-slate-400">Atur ulang sandi akun dosen</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-800">{resetTarget.fullName}</p>
                <p className="text-[10px] text-slate-500">
                  NIDN: {resetTarget.nidn} • {resetTarget.email}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="text"
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  placeholder="Masukkan kata sandi baru"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Default yang disarankan: <strong>password123</strong>
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simpan Sandi Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
