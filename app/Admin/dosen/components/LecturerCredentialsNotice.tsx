import React from "react";
import { KeyRound } from "lucide-react";

export function LecturerCredentialsNotice() {
  return (
    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <KeyRound className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-slate-800">
            Seluruh data dosen di bawah ini siap digunakan untuk login ke Portal Dosen (/auth/login)
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Admin dapat mengatur atau mereset kata sandi akun dosen melalui tombol aksi di tabel. Kata sandi yang tersimpan dienkripsi secara aman dan tidak ditampilkan kembali ke antarmuka demi menjaga kerahasiaan akun.
          </p>
        </div>
      </div>
    </div>
  );
}

