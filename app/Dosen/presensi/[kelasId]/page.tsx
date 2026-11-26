"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ArrowLeft, CheckCircle2, MapPin, Users, AlertTriangle } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import {
  AttendanceStatus,
  ClassAttendanceDetailResponse,
  CorrectableStatus,
  StudentAttendanceRow,
} from "@/types/attendance";
import {
  AttendanceFilterBar,
  AttendanceStatsCards,
  AttendanceTable,
  CorrectionStatusModal,
  MedicalLetterPreviewModal,
} from "../components";

export default function DetailPresensiKelasPage() {
  const params = useParams();
  const kelasId = Number(params?.kelasId);

  const [detail, setDetail] = useState<ClassAttendanceDetailResponse | null>(null);
  const [pertemuan, setPertemuan] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTogglingSession, setIsTogglingSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");

  // Modals
  const [correctionStudent, setCorrectionStudent] = useState<StudentAttendanceRow | null>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<StudentAttendanceRow | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }, []);

  const fetchAttendance = useCallback(
    async (targetPertemuan?: number, silent = false) => {
      if (!kelasId || isNaN(kelasId)) return;
      try {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        const data = await attendanceService.getClassAttendance(kelasId, targetPertemuan);
        setDetail(data);
        setPertemuan(data.session.pertemuan);
        setErrorMsg("");
      } catch (err: any) {
        setErrorMsg(err?.message || "Gagal memuat data presensi kelas.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [kelasId]
  );

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Auto-refresh setiap 12 detik ketika sesi mobile terbuka agar real-time
  useEffect(() => {
    if (!detail?.session.is_open) return;
    const interval = setInterval(() => {
      fetchAttendance(detail.session.pertemuan, true);
    }, 12000);
    return () => clearInterval(interval);
  }, [detail?.session.is_open, detail?.session.pertemuan, fetchAttendance]);

  const handlePertemuanChange = (newPertemuan: number) => {
    setPertemuan(newPertemuan);
    fetchAttendance(newPertemuan, true);
  };

  const handleToggleSession = async () => {
    if (!detail) return;
    const targetPertemuan = pertemuan || detail.session.pertemuan;
    const nextOpen = !detail.session.is_open;
    try {
      setIsTogglingSession(true);
      const res = await attendanceService.toggleSession(kelasId, targetPertemuan, nextOpen);
      showToast(res.message);
      await fetchAttendance(targetPertemuan, true);
    } catch (err: any) {
      showToast(err?.message || "Gagal mengubah status sesi presensi.");
    } finally {
      setIsTogglingSession(false);
    }
  };

  const handleCorrectionSubmit = async (
    status: CorrectableStatus,
    alasanKoreksi: string
  ) => {
    if (!correctionStudent || !detail) return;
    try {
      setIsCorrecting(true);
      const res = await attendanceService.correctStatus(
        kelasId,
        correctionStudent.student_id,
        {
          pertemuan: detail.session.pertemuan,
          status,
          alasan_koreksi: alasanKoreksi,
        }
      );
      setCorrectionStudent(null);
      showToast(res.message);
      await fetchAttendance(detail.session.pertemuan, true);
    } catch (err: any) {
      showToast(err?.message || "Gagal menyimpan koreksi status.");
    } finally {
      setIsCorrecting(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!detail) return [];
    const q = searchQuery.trim().toLowerCase();
    return detail.students.filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesQuery =
        !q || s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [detail, searchQuery, statusFilter]);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-hidden">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <Sidebar currentPath="/dosen/presensi" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            breadcrumbs={[
              "Portal",
              "Presensi Kelas",
              detail ? `${detail.class.code} - ${detail.class.title}` : "Detail Kelas",
            ]}
          />

          <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Top Back & Class Summary Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <Link
                  href="/dosen/presensi"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all shrink-0"
                  title="Kembali ke Jadwal Mengajar"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {detail ? (
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-xs">
                        {detail.class.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[10px]">
                        Aktif • {detail.class.sks} SKS
                      </span>
                    </div>
                    <h1 className="font-bold text-slate-900 text-base">
                      {detail.class.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {detail.class.room || "Ruang Teori"}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {detail.stats.total} Mahasiswa Terdaftar
                      </span>
                      {detail.class.schedule && (
                        <>
                          <span>•</span>
                          <span>{detail.class.schedule}</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-12 w-64 bg-slate-100 rounded-xl animate-pulse" />
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
                  ))}
                </div>
                <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
              </div>
            ) : errorMsg || !detail ? (
              <div className="bg-white rounded-xl border border-rose-200 p-8 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Gagal Memuat Presensi</p>
                <p className="text-xs text-slate-500">{errorMsg || "Kelas tidak ditemukan."}</p>
              </div>
            ) : (
              <>
                <AttendanceStatsCards stats={detail.stats} />

                <AttendanceFilterBar
                  pertemuan={detail.session.pertemuan}
                  onPertemuanChange={handlePertemuanChange}
                  sessionDate={detail.session.date}
                  isSessionOpen={detail.session.is_open}
                  isTogglingSession={isTogglingSession}
                  onToggleSession={handleToggleSession}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  onRefresh={() => fetchAttendance(detail.session.pertemuan, true)}
                  isRefreshing={isRefreshing}
                />

                <AttendanceTable
                  students={filteredStudents}
                  onOpenCorrection={(student) => setCorrectionStudent(student)}
                  onPreviewAttachment={(student) => setPreviewStudent(student)}
                />
              </>
            )}
          </main>
        </div>

        <CorrectionStatusModal
          student={correctionStudent}
          isOpen={Boolean(correctionStudent)}
          isSubmitting={isCorrecting}
          onClose={() => setCorrectionStudent(null)}
          onSubmit={handleCorrectionSubmit}
        />

        <MedicalLetterPreviewModal
          student={previewStudent}
          isOpen={Boolean(previewStudent)}
          onClose={() => setPreviewStudent(null)}
          onOpenCorrection={(student) => setCorrectionStudent(student)}
        />
      </div>
    </AuthGuard>
  );
}

