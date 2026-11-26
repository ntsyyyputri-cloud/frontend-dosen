"use client";

import React from "react";
import { X, FileText, Clock, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { StudentAttendanceRow } from "@/types/attendance";

interface MedicalLetterPreviewModalProps {
  student: StudentAttendanceRow | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCorrection: (student: StudentAttendanceRow) => void;
}

export function MedicalLetterPreviewModal({
  student,
  isOpen,
  onClose,
  onOpenCorrection,
}: MedicalLetterPreviewModalProps) {
  if (!isOpen || !student) return null;

  const isImageUrl = Boolean(
    student.attachment_url &&
      /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(student.attachment_url)
  );

  const uploadedTime = student.updated_at || student.created_at || student.date || "Baru saja";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Pratinjau Surat Keterangan / Bukti Izin
              </h3>
              <p className="text-[11px] text-slate-500">
                Diunggah oleh mahasiswa melalui Gradia Mobile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Student & Upload Info */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-900">{student.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">NIM: {student.nim}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border capitalize ${
                  student.status === "sakit"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                Pengajuan: {student.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-indigo-100/80 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Waktu Unggah: {uploadedTime}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {student.audit_dosen ? "Sudah Diaudit Dosen" : "Menunggu / Tervalidasi Sistem"}
              </span>
            </div>
          </div>

          {/* Alasan Mahasiswa */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Keterangan Mahasiswa
            </p>
            <p className="text-xs text-slate-800 leading-relaxed">
              {student.notes || "Tidak ada catatan tambahan."}
            </p>
          </div>

          {/* Attachment Preview */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            {student.attachment_url ? (
              isImageUrl ? (
                <div className="p-2 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={student.attachment_url}
                    alt={`Bukti ${student.status} ${student.name}`}
                    className="max-h-64 w-auto rounded-lg object-contain"
                  />
                  <a
                    href={student.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>Buka Lampiran Penuh</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <FileText className="w-8 h-8 text-indigo-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-800">Lampiran Dokumen Tersedia</p>
                  <a
                    href={student.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    <span>Lihat / Unduh Dokumen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                Mahasiswa tidak melampirkan file gambar/dokumen tambahan.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCorrection(student);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Koreksi / Validasi Status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

