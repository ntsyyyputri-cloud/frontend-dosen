import React from "react";
import { KeyRound, X, RefreshCw, CheckCircle2 } from "lucide-react";
import { LecturerData } from "@/types/lecturer";

interface ResetPasswordModalProps {
  target: LecturerData | null;
  resetPasswordVal: string;
  onPasswordChange: (val: string) => void;
  isResetting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResetPasswordModal({
  target,
  resetPasswordVal,
  onPasswordChange,
  isResetting,
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reset Kata Sandi</h3>
              <p className="text-[11px] text-slate-400">Atur ulang sandi akun dosen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-bold text-slate-800">{target.fullName}</p>
            <p className="text-[10px] text-slate-500">
              NIDN: {target.nidn} • {target.email}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi Baru *
            </label>
            <input
              type="text"
              value={resetPasswordVal}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Masukkan kata sandi baru"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              required
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Default yang disarankan: <strong>password123</strong>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isResetting}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Sandi Baru</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

