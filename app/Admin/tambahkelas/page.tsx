"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiFetch } from "@/lib/api";
import {
  PlusCircle,
  CheckCircle2,
  ArrowLeft,
  Layers,
} from "lucide-react";

interface LecturerOption {
  id: number;
  nidn: string;
  name: string;
  fullName: string;
}

const PRODI_OPTIONS = [
  "S1 Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "D3 Manajemen Informatika",
];

const ACADEMIC_YEAR_OPTIONS = [
  "2024/2025 Ganjil",
  "2024/2025 Genap",
  "2025/2026 Ganjil",
  "2025/2026 Genap",
];

export default function AdminTambahKelasPage() {
  const router = useRouter();
  const [lecturers, setLecturers] = useState<LecturerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLecturers, setIsFetchingLecturers] = useState(true);

  // Toast notification
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Form state
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    const fetchLecturers = async () => {
      setIsFetchingLecturers(true);
      try {
        const res = await apiFetch("/admin/lecturers");
        if (res.lecturers) {
          setLecturers(res.lecturers);
          if (res.lecturers.length > 0) {
            setFormData((prev) => ({
              ...prev,
              lecturer_id: String(res.lecturers[0].id),
            }));
          }
        }
      } catch (e) {
        notify("Gagal memuat data dosen.", "error");
      } finally {
        setIsFetchingLecturers(false);
      }
    };
    fetchLecturers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sks" || name === "semester" || name === "capacity"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      notify("Kode kelas wajib diisi.", "error");
      return;
    }
    if (!formData.title.trim()) {
      notify("Nama mata kuliah wajib diisi.", "error");
      return;
    }
    if (!formData.lecturer_id) {
      notify("Dosen pengampu wajib dipilih.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch("/admin/classes", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      notify("Kelas baru berhasil ditambahkan!");
      setTimeout(() => {
        router.push("/Admin/kelas");
      }, 1500);
    } catch (err: any) {
      notify("Gagal menambahkan kelas: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      code: "",
      title: "",
      sks: 3,
      prodi: "S1 Informatika",
      semester: 1,
      academic_year: "2024/2025 Ganjil",
      capacity: 40,
      schedule: "",
      room: "",
      lecturer_id: lecturers[0] ? String(lecturers[0].id) : "",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs border ${
            toastType === "success"
              ? "bg-slate-900 text-white border-slate-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <AdminSidebar currentPath="/Admin/tambahkelas" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Tambah Kelas Baru"]} />

        <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Tambah Kelas Perkuliahan Baru</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Isi formulir di bawah untuk membuat rombongan belajar baru di sistem akademik.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/Admin/kelas")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs shadow-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Manajemen Kelas</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800">Data Kelas</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Kode & SKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kode Kelas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    placeholder="Contoh: TIF-201"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bobot SKS
                  </label>
                  <input
                    type="number"
                    name="sks"
                    min={1}
                    max={6}
                    value={formData.sks}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Nama Mata Kuliah */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Mata Kuliah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Algoritma & Pemrograman"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Dosen Pengampu */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dosen Pengampu <span className="text-rose-500">*</span>
                </label>
                {isFetchingLecturers ? (
                  <div className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-400 bg-slate-50">
                    Memuat daftar dosen...
                  </div>
                ) : (
                  <select
                    name="lecturer_id"
                    required
                    value={formData.lecturer_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white transition-all"
                  >
                    <option value="">Pilih Dosen Pengampu...</option>
                    {lecturers.map((lec) => (
                      <option key={lec.id} value={lec.id}>
                        {lec.fullName || lec.name} (NIDN: {lec.nidn})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Program Studi & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Program Studi
                  </label>
                  <select
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white transition-all"
                  >
                    {PRODI_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    min={1}
                    max={8}
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Tahun Akademik & Kapasitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tahun Akademik
                  </label>
                  <select
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white transition-all"
                  >
                    {ACADEMIC_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kapasitas Maksimal Mahasiswa
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    min={1}
                    max={200}
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Jadwal & Ruangan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jadwal Pertemuan
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    placeholder="Contoh: Senin, 08:00 - 10:30 WIB"
                    value={formData.schedule}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ruangan
                  </label>
                  <input
                    type="text"
                    name="room"
                    placeholder="Contoh: Lab Komputer 1"
                    value={formData.room}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all"
                >
                  Reset Form
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/Admin/kelas")}
                    className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || isFetchingLecturers}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Buat Kelas</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

