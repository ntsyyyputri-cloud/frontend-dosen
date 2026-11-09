import React from "react";
import { Trash2 } from "lucide-react";
import { LecturerData } from "@/types/lecturer";

interface DeleteLecturerModalProps {
  target: LecturerData | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteLecturerModal({
  target,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteLecturerModalProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Dosen</h3>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus akun dosen{" "}
            <span className="font-bold text-slate-800">{target.fullName}</span>?
            Semua data kelas terkait juga akan dihapus.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm disabled:bg-rose-300"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

