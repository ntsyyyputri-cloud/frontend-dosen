"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiFetch } from "@/lib/api";
import {
  Layers,
  Search,
  GraduationCap,
  Users,
  Calendar,
  MapPin,
  Clock,
  Building,
  RefreshCw,
  BookOpen,
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

const PRODI_OPTIONS = [
  "Semua Prodi",
  "S1 Informatika",
  "S1 Sistem Informasi",
  "S1 Teknologi Informasi",
  "D3 Manajemen Informatika",
];

export default function AdminKelasPage() {
  const [classes, setClasses] = useState<CampusClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("Semua Prodi");
  const [selectedSemester, setSelectedSemester] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchCampusClasses();
  }, []);

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
      <AdminSidebar currentPath="/Admin/kelas" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Monitoring Seluruh Kelas"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Monitoring Kelas Perkuliahan Kampus</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Pantau seluruh rombongan belajar, beban mengajar dosen, dan kapasitas mahasiswa lintas program studi.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCampusClasses}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition-all w-fit"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Muat Ulang Data</span>
            </button>
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

          {/* Classes Grid / Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Kode & Mata Kuliah</th>
                    <th className="py-3 px-4">Dosen Pengampu</th>
                    <th className="py-3 px-4">Program Studi</th>
                    <th className="py-3 px-4">Jadwal & Ruang</th>
                    <th className="py-3 px-4 text-center">Kapasitas Mahasiswa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                        <span>Memuat seluruh kelas kampus...</span>
                      </td>
                    </tr>
                  ) : filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
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
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                                {c.lecturer_name[0] || "D"}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-xs">{c.lecturerFullName}</p>
                                <p className="text-[10px] text-slate-400">NIDN: {c.lecturer_nidn}</p>
                              </div>
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
                              <p className="text-slate-700 font-medium flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{c.schedule || "Belum diatur"}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{c.room || "Ruang Kuliah"}</span>
                              </p>
                            </div>
                          </td>

                          {/* Kapasitas & Progress */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="max-w-[140px] mx-auto space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-semibold">
                                <span className="text-indigo-600 font-bold">{enrolled} Mhs</span>
                                <span className="text-slate-400">Kapasitas {capacity}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
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
    </div>
  );
}
