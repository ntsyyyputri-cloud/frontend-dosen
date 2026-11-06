"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecentLecturer } from "@/types/admin";

export interface RecentLecturersCardProps {
  recentLecturers: RecentLecturer[];
}

export default function RecentLecturersCard({
  recentLecturers,
}: RecentLecturersCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Dosen Baru Terdaftar</h2>
          <p className="text-slate-400 text-[11px]">Akun dosen yang baru-baru ini dibuat</p>
        </div>
        <Link
          href="/Admin/dosen"
          className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1"
        >
          <span>Kelola Dosen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentLecturers.length === 0 ? (
          <p className="text-slate-400 italic text-center py-4 col-span-full">
            Belum ada dosen yang terdaftar.
          </p>
        ) : (
          recentLecturers.map((lec) => {
            const fullName = `${lec.title_prefix ? lec.title_prefix + " " : ""}${
              lec.name
            }${lec.title_suffix ? ", " + lec.title_suffix : ""}`.trim();

            return (
              <div
                key={lec.id}
                className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  {lec.name[0] || "D"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 text-xs truncate">{fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    NIDN: {lec.nidn} • {lec.email}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

