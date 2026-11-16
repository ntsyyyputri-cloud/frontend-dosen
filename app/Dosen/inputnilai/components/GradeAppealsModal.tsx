"use client";

import React, { useState } from "react";
import { X, MessageSquare, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { GradeAppeal } from "@/types/grade";

interface GradeAppealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appeals: GradeAppeal[];
  onUpdateStatus: (appealId: number, status: "approved" | "rejected", response?: string) => Promise<void>;
}

export function GradeAppealsModal({
  isOpen,
  onClose,
  appeals,
  onUpdateStatus,
}: GradeAppealsModalProps) {
  const [activeAppealId, setActiveAppealId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (appealId: number, status: "approved" | "rejected") => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(appealId, status, responseText);
      setActiveAppealId(null);
      setResponseText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Pengajuan Koreksi Nilai Mahasiswa
              </h3>
              <p className="text-[11px] text-slate-500">
                Daftar sanggahan dan komentar dari aplikasi mobile Gradia-PBL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {appeals.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium">Belum ada pengajuan koreksi nilai dari mahasiswa di kelas ini.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Komentar mahasiswa dari aplikasi mobile akan muncul di sini secara otomatis.
              </p>
            </div>
          ) : (
            appeals.map((appeal) => {
              const isSelected = activeAppealId === appeal.id;
              const isPending = appeal.status === "pending";

              return (
                <div
                  key={appeal.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isPending
                      ? "border-amber-200/80 bg-amber-50/30"
                      : appeal.status === "approved"
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-slate-200 bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">
                          {appeal.student_name || "Mahasiswa"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({appeal.student_nim || `ID: ${appeal.student_id}`})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            appeal.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : appeal.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appeal.status === "pending"
                            ? "Menunggu Review"
                            : appeal.status === "approved"
                            ? "Disetujui"
                            : "Ditolak"}
                        </span>
                      </div>

                      <div className="mt-2 text-xs">
                        <span className="text-slate-500">Soal yang ditinjau: </span>
                        <span className="font-semibold text-slate-800">
                          {appeal.question_title}
                        </span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="text-slate-500">Nilai saat ini: </span>
                        <span className="font-semibold text-indigo-600">
                          {appeal.current_score}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(appeal.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Komentar Mahasiswa */}
                  <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Komentar / Sanggahan Mahasiswa:
                    </div>
                    &ldquo;{appeal.comment}&rdquo;
                  </div>

                  {/* Tanggapan Dosen (jika ada) */}
                  {appeal.lecturer_response && (
                    <div className="mt-2 p-2.5 bg-slate-100/70 rounded-lg text-[11px] text-slate-600 border border-slate-200/50">
                      <span className="font-semibold text-slate-700">Tanggapan Dosen: </span>
                      {appeal.lecturer_response}
                    </div>
                  )}

                  {/* Aksi Dosen (jika status masih pending) */}
                  {isPending && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-col gap-2">
                      {isSelected ? (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Catatan atau alasan untuk mahasiswa (opsional)..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                            rows={2}
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAppealId(null);
                                setResponseText("");
                              }}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleAction(appeal.id, "rejected")}
                              className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
                            >
                              Tolak Sanggahan
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleAction(appeal.id, "approved")}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                            >
                              Setujui & Ubah Nilai
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 italic">
                            Mahasiswa meminta pengecekan ulang butir penilaian ini.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveAppealId(appeal.id);
                              setResponseText("");
                            }}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors border border-indigo-200"
                          >
                            Respon / Beri Tanggapan
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Total {appeals.length} pengajuan koreksi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

