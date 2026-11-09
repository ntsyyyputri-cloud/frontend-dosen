import React from "react";
import {
  Mail,
  Phone,
  Building,
  Layers,
  KeyRound,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { LecturerData } from "@/types/lecturer";

interface LecturerTableProps {
  lecturers: LecturerData[];
  isLoading: boolean;
  onOpenResetPassword: (lec: LecturerData) => void;
  onOpenDeleteConfirm: (lec: LecturerData) => void;
  onViewClasses?: (lec: LecturerData) => void;
}

export function LecturerTable({
  lecturers,
  isLoading,
  onOpenResetPassword,
  onOpenDeleteConfirm,
  onViewClasses,
}: LecturerTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden notranslate" translate="no">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Dosen & NIDN</th>
              <th className="py-3 px-4">Kontak & Email</th>
              <th className="py-3 px-4">Ruang Kantor</th>
              <th className="py-3 px-4 text-center">Kelas Diampu</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>Memuat data dosen kampus...</span>
                </td>
              </tr>
            ) : lecturers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                  Tidak ada dosen yang cocok dengan pencarian Anda.
                </td>
              </tr>
            ) : (
              lecturers.map((lec) => (
                <tr key={lec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {lec.name?.[0] || "D"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{lec.fullName || lec.name}</p>
                        <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                          NIDN: {lec.nidn}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="text-slate-700 font-medium flex items-center gap-1.5 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lec.email}</span>
                      </p>
                      {lec.phone && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lec.phone}</span>
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lec.office_room || "-"}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {onViewClasses ? (
                      <button
                        type="button"
                        onClick={() => onViewClasses(lec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                        title={`Lihat kelas yang diampu oleh ${lec.name}`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{lec.total_classes ?? (lec as any).class_count ?? 0} Kelas</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                        <Layers className="w-3 h-3" />
                        <span>{lec.total_classes ?? (lec as any).class_count ?? 0} Kelas</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Tombol Reset Kata Sandi */}
                      <button
                        type="button"
                        onClick={() => onOpenResetPassword(lec)}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        title="Reset Kata Sandi Dosen"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>

                      {/* Tombol Hapus Akun Dosen */}
                      <button
                        type="button"
                        onClick={() => onOpenDeleteConfirm(lec)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Hapus Akun Dosen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

