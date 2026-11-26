"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Calendar, ClipboardCheck } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { LecturerScheduleItem } from "@/types/attendance";
import { ScheduleCourseCard } from "./components";

export default function PresensiPage() {
  const [classes, setClasses] = useState<LecturerScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSchedule() {
      try {
        setIsLoading(true);
        const res = await attendanceService.getSchedule();
        if (active) {
          setClasses(res.classes || []);
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err?.message || "Gagal memuat jadwal mengajar.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadSchedule();
    return () => {
      active = false;
    };
  }, []);

  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-hidden">
        <Sidebar currentPath="/dosen/presensi" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header breadcrumbs={["Portal", "Utama", "Presensi Kelas"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Page Title Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 text-base">
                    Jadwal Mengajar Hari Ini
                  </h1>
                  <p className="text-xs text-slate-500">
                    Sinkronisasi langsung dengan Sistem Akademik & Presensi Mobile Mahasiswa
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md self-start sm:self-auto">
                <Calendar className="w-3.5 h-3.5" />
                {todayFormatted}
              </span>
            </div>

            {/* Schedule List Container */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-slate-100 animate-pulse border border-slate-200/60"
                    />
                  ))}
                </div>
              ) : errorMsg ? (
                <div className="text-center py-8 text-rose-600 text-xs font-medium">
                  {errorMsg}
                </div>
              ) : classes.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-xs font-semibold text-slate-600">
                    Belum ada kelas yang ditugaskan kepada Anda.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Silakan hubungi Administrator Kampus untuk alokasi penugasan kelas perkuliahan.
                  </p>
                </div>
              ) : (
                classes.map((course) => (
                  <ScheduleCourseCard key={course.id} course={course} />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

