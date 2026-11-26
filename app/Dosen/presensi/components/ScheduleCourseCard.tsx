"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Radio } from "lucide-react";
import { LecturerScheduleItem } from "@/types/attendance";

interface ScheduleCourseCardProps {
  course: LecturerScheduleItem;
}

export function ScheduleCourseCard({ course }: ScheduleCourseCardProps) {
  return (
    <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-200 hover:bg-white transition-all shadow-2xs">
      <div className="flex items-center gap-4 min-w-0">
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center min-w-[78px] shadow-2xs shrink-0">
          <p className="font-bold text-indigo-600 text-xs">{course.code}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{course.sks} SKS</p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="font-bold text-slate-900 text-sm truncate">{course.title}</h4>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-100 shrink-0">
              Aktif
            </span>
            {course.is_session_open && course.active_pertemuan && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full text-[10px] border border-indigo-100 shrink-0">
                <Radio className="w-3 h-3 animate-pulse text-indigo-600" />
                Presensi P{course.active_pertemuan} Dibuka ({course.present_count}/{course.enrolled_count})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {course.room || "Ruang Teori"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              {course.enrolled_count || 0} Mahasiswa Terdaftar
            </span>
            {course.schedule && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{course.schedule}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/dosen/presensi/${course.id}`}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-2xs text-xs shrink-0 active:scale-[0.98]"
      >
        <span>Buka Presensi</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

