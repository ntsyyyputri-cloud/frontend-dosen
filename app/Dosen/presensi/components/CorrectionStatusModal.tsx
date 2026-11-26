"use client";

import React, { useEffect, useState } from "react";
import { X, ShieldCheck, CheckCircle2, Clock, Stethoscope, AlertCircle } from "lucide-react";
import { CorrectableStatus, StudentAttendanceRow } from "@/types/attendance";

interface CorrectionStatusModalProps {
  student: StudentAttendanceRow | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (status: CorrectableStatus, alasanKoreksi: string) => Promise<void>;
}

const QUICK_REASONS = [
  "Hadir terlambat (konfirmasi di kelas)",
  "Kendala jaringan / aplikasi mobile",
  "Surat keterangan dokter terverifikasi",
  "Izin kegiatan akademik / organisasi",
  "Tidak hadir tanpa konfirmasi",
];

const STATUS_OPTIONS: {
  key: CorrectableStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "hadir", label: "Hadir", icon: CheckCircle2 },
  { key: "izin", label: "Izin", icon: Clock },
  { key: "sakit", label: "Sakit", icon: Stethoscope },
  { key: "alpa", label: "Alpha", icon: AlertCircle },
];

export function CorrectionStatusModal({
  student,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CorrectionStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<CorrectableStatus>("hadir");
  const [alasan, setAlasan] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen && student) {
      const initial: CorrectableStatus =
        student.status === "belum" ? "hadir" : (student.status as CorrectableStatus);
      setSelectedStatus(initial);
      setAlasan(student.alasan_koreksi || "");
      setErrorMsg("");
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alasan.trim().length < 3) {
      setErrorMsg("Alasan koreksi wajib diisi minimal 3 karakter untuk audit log dosen.");
      return;
    }
    setErrorMsg("");
    await onSubmit(selectedStatus, alasan.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Koreksi Status Kehadiran</h3>
              <p className="text-[11px] text-slate-500">Perubahan tercatat di audit log & mobile</p>
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

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {/* Info Mahasiswa */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-900">{student.name}</p>
              <p className="text-[11px] text-slate-500 font-mono">NIM: {student.nim}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white text-indigo-700 border border-indigo-200 capitalize">
              Saat ini: {student.status === "belum" ? "Belum Absen" : student.status}
            </span>
          </div>

          {/* Pilihan Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Status Kehadiran Baru
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = selectedStatus === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedStatus(opt.key)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alasan Koreksi (Wajib) */}
          <div>
            <label htmlFor="alasan-koreksi" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alasan Koreksi (Audit Log Dosen) <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alasan-koreksi"
              rows={3}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan perubahan status kehadiran mahasiswa..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              required
            />
            {errorMsg && <p className="text-[11px] text-rose-600 mt-1">{errorMsg}</p>}
          </div>

          {/* Chip Saran Cepat */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 mb-1.5">Saran Alasan Cepat:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setAlasan(chip)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Koreksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

