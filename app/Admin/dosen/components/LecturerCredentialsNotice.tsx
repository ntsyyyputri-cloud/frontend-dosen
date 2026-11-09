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
            Kata sandi bawaan seluruh akun dosen adalah:{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-bold text-indigo-700">
              password123
            </code>
            . Anda juga dapat menggunakan tombol{" "}
            <strong className="text-indigo-600 font-bold">Login Cepat</strong> di bawah untuk langsung membuka Dashboard Dosen dengan satu klik tanpa memasukkan kata sandi.
          </p>
        </div>
      </div>
    </div>
  );
}

