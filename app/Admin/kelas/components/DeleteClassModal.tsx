"use client";

import React from "react";

interface DeleteClassModalProps {
  deletingClassId: number | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export function DeleteClassModal({
  deletingClassId,
  onClose,
  onConfirm,
}: DeleteClassModalProps) {
  if (!deletingClassId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
        <h4 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Kelas</h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini akan menghapus data rombongan belajar dan seluruh nilai terkait.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(deletingClassId)}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

