"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, MessageSquareWarning, X, XCircle } from "lucide-react";
import { TeachingClass } from "@/types/dashboard";
import { gradeService } from "@/services/gradeService";

type EvaluationItemCategory = "Nilai UAS" | "Nilai UTS" | "Kelalaian Dosen";

interface LecturerEvaluationItem {
  id: number;
  category: EvaluationItemCategory;
  studentName: string;
  studentNim: string;
  classCode: string;
  title: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  lecturerResponse?: string;
  createdAt: string;
  isFromBackend?: boolean;
}

const FALLBACK_EVALUATIONS: LecturerEvaluationItem[] = [
  {
    id: 9001,
    category: "Nilai UAS",
    studentName: "Rizky Pratama",
    studentNim: "251234567801",
    classCode: "IF2408",
    title: "Koreksi Nilai UAS · Bagian Essay",
    comment:
      "Mohon peninjauan ulang nilai UAS nomor 3 dan 4 karena jawaban implementasi algoritma sudah sesuai rubrik namun poin belum terhitung.",
    status: "pending",
    createdAt: "2024-10-24T09:15:00Z",
  },
  {
    id: 9002,
    category: "Nilai UTS",
    studentName: "Nadia Putri",
    studentNim: "251234567814",
    classCode: "IF301",
    title: "Koreksi Nilai UTS · Studi Kasus",
    comment:
      "Nilai UTS di portal masih 68, padahal pada lembar koreksi kelas tertulis 82 setelah perbaikan diagram UML.",
    status: "pending",
    createdAt: "2024-10-23T14:30:00Z",
  },
  {
    id: 9003,
    category: "Kelalaian Dosen",
    studentName: "Bagas Saputra",
    studentNim: "251234567822",
    classCode: "IF202",
    title: "Laporan Kelalaian · Jadwal & Input Nilai",
    comment:
      "Perkuliahan minggu ke-6 dimulai terlambat 40 menit tanpa pemberitahuan sebelumnya dan rekap nilai tugas 2 belum diunggah hingga batas waktu.",
    status: "pending",
    createdAt: "2024-10-22T11:00:00Z",
  },
];

function detectCategory(component: string, reason: string): EvaluationItemCategory {
  const combined = `${component} ${reason}`.toLowerCase();
  if (combined.includes("uas")) return "Nilai UAS";
  if (combined.includes("uts")) return "Nilai UTS";
  if (
    combined.includes("lalai") ||
    combined.includes("kelalaian") ||
    combined.includes("terlambat") ||
    combined.includes("tidak hadir")
  ) {
    return "Kelalaian Dosen";
  }
  return "Nilai UAS";
}

interface LecturerEvaluationCardProps {
  classes: TeachingClass[];
}

export function LecturerEvaluationCard({ classes }: LecturerEvaluationCardProps) {
  const [evaluations, setEvaluations] = useState<LecturerEvaluationItem[]>(FALLBACK_EVALUATIONS);
  const [selectedItem, setSelectedItem] = useState<LecturerEvaluationItem | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!classes || classes.length === 0) return;

    let cancelled = false;
    const loadAppeals = async () => {
      try {
        const results = await Promise.allSettled(
          classes.map((c) => gradeService.getAppealsByClass(c.id))
        );
        const mapped: LecturerEvaluationItem[] = [];
        results.forEach((res) => {
          if (res.status === "fulfilled" && Array.isArray(res.value.appeals)) {
            res.value.appeals.forEach((a: any) => {
              mapped.push({
                id: a.id,
                category: detectCategory(a.question_title || a.component || "", a.comment || a.reason || ""),
                studentName: a.student_name || "Mahasiswa",
                studentNim: a.student_nim || `ID: ${a.student_id}`,
                classCode: a.class_code || "Kelas",
                title: a.question_title || a.component || "Koreksi Mahasiswa",
                comment: a.comment || a.reason || "",
                status: a.status || "pending",
                lecturerResponse: a.lecturer_response || "",
                createdAt: a.created_at || new Date().toISOString(),
                isFromBackend: true,
              });
            });
          }
        });

        if (!cancelled && mapped.length > 0) {
          setEvaluations([...mapped, ...FALLBACK_EVALUATIONS]);
        }
      } catch {
        // Keep fallback evaluations on network error
      }
    };

    loadAppeals();
    return () => {
      cancelled = true;
    };
  }, [classes]);

  const pendingCount = useMemo(
    () => evaluations.filter((item) => item.status === "pending").length,
    [evaluations]
  );

  const handleAction = async (status: "approved" | "rejected") => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      if (selectedItem.isFromBackend) {
        await gradeService.updateAppeal(selectedItem.id, status, responseText);
      }
      setEvaluations((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, status, lecturerResponse: responseText || item.lecturerResponse }
            : item
        )
      );
      setSelectedItem(null);
      setResponseText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryBadgeStyle = (category: EvaluationItemCategory) => {
    switch (category) {
      case "Nilai UAS":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Nilai UTS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Kelalaian Dosen":
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Evaluasi Dosen</h3>
          <p className="text-[10px] text-slate-400">
            Koreksi mahasiswa terkait nilai UAS, UTS, dan kelalaian dosen
          </p>
        </div>
        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded shrink-0">
          {pendingCount} Perlu Tinjauan
        </span>
      </div>

      {/* Daftar Koreksi & Evaluasi */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-0.5">
        {evaluations.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <MessageSquareWarning className="w-6 h-6 mx-auto text-slate-300 mb-1.5" />
            <p className="text-[11px]">Belum ada koreksi mahasiswa.</p>
          </div>
        ) : (
          evaluations.map((item) => (
            <div
              key={`${item.isFromBackend ? "db" : "sample"}-${item.id}`}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:border-slate-200 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border ${categoryBadgeStyle(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : item.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {item.status === "pending"
                    ? "Menunggu"
                    : item.status === "approved"
                    ? "Ditindaklanjuti"
                    : "Ditolak"}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-[11px] leading-snug">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed line-clamp-2">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-500 truncate">
                  <span className="font-semibold text-slate-700">{item.studentName}</span>
                  <span> • {item.classCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(item);
                    setResponseText(item.lecturerResponse || "");
                  }}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold rounded-md hover:bg-indigo-100 transition-all text-[10px] border border-indigo-200 shrink-0"
                >
                  Tinjau
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tinjau Evaluasi */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Detail Evaluasi & Koreksi</h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedItem.studentName} ({selectedItem.studentNim}) • {selectedItem.classCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${categoryBadgeStyle(
                    selectedItem.category
                  )}`}
                >
                  {selectedItem.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {new Date(selectedItem.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <p className="text-xs font-bold text-slate-900">{selectedItem.title}</p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  &ldquo;{selectedItem.comment}&rdquo;
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Tanggapan / Klarifikasi Dosen
                </label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tuliskan tanggapan atau tindak lanjut atas koreksi mahasiswa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleAction("rejected")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-semibold text-xs hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tolak</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleAction("approved")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Tindak Lanjuti</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

