"use client";

import React from "react";
import { Edit3, FileText, ShieldCheck, Smartphone } from "lucide-react";
import { AttendanceStatus, StudentAttendanceRow } from "@/types/attendance";

interface AttendanceTableProps {
  students: StudentAttendanceRow[];
  onOpenCorrection: (student: StudentAttendanceRow) => void;
  onPreviewAttachment: (student: StudentAttendanceRow) => void;
}

const STATUS_BADGE_MAP: Record<AttendanceStatus, { label: string; className: string }> = {
  hadir: {
    label: "Hadir",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  izin: {
    label: "Izin",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  sakit: {
    label: "Sakit",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  alpa: {
    label: "Alpha",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  belum: {
    label: "Belum Absen",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export function AttendanceTable({
  students,
  onOpenCorrection,
  onPreviewAttachment,
}: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4">Mahasiswa</th>
              <th className="py-3.5 px-4">Status Kehadiran</th>
              <th className="py-3.5 px-4">Keterangan / Sumber</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Tidak ada mahasiswa yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              students.map((student, index) => {
                const badge = STATUS_BADGE_MAP[student.status] || STATUS_BADGE_MAP.belum;
                const hasEvidence =
                  (student.status === "sakit" || student.status === "izin") &&
                  (Boolean(student.attachment_url) || Boolean(student.notes));

                return (
                  <tr
                    key={student.student_id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {student.name?.charAt(0) || "M"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{student.nim}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {student.audit_dosen && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                            title={student.alasan_koreksi || "Dikoreksi oleh dosen"}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            Audit Dosen
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-xs">
                        {student.notes ? (
                          <p className="text-slate-700 flex items-center gap-1.5">
                            <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{student.notes}</span>
                          </p>
                        ) : (
                          <p className="text-slate-400 italic text-[11px]">Belum ada catatan</p>
                        )}
                        {student.audit_dosen && student.alasan_koreksi && (
                          <p className="text-[11px] text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-2 py-1">
                            Alasan Koreksi: {student.alasan_koreksi}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {hasEvidence && (
                          <button
                            type="button"
                            onClick={() => onPreviewAttachment(student)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Lihat Bukti</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenCorrection(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Koreksi</span>
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
  );
}

