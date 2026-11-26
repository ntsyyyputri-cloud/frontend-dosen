"use client";

import React, { type ChangeEvent } from "react";
import { CheckCircle2, AlertCircle, Clock, SearchX } from "lucide-react";
import { GradeStudent, GradeResult, ScoreField, WeightConfig } from "@/types/grade";

interface GradeTableProps {
  students: GradeStudent[];
  selectedIds: number[];
  weights: WeightConfig;
  onSelectAll?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
  onScoreChange: (id: number, field: ScoreField, val: string) => void;
  calculateFinalGrade: (t: number | null, u: number | null, a: number | null) => GradeResult;
}

export function GradeTable({
  students,
  selectedIds,
  weights,
  onSelectOne,
  onScoreChange,
  calculateFinalGrade,
}: GradeTableProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, field: ScoreField) => {
    const fields: ScoreField[] = ["tugas", "uts", "uas"];
    const fieldIndex = fields.indexOf(field);

    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextInput = document.getElementById(`score-input-${field}-${rowIndex + 1}`);
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevInput = document.getElementById(`score-input-${field}-${rowIndex - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && fieldIndex < 2) {
      const nextColInput = document.getElementById(`score-input-${fields[fieldIndex + 1]}-${rowIndex}`);
      if (nextColInput) nextColInput.focus();
    } else if (e.key === "ArrowLeft" && fieldIndex > 0) {
      const prevColInput = document.getElementById(`score-input-${fields[fieldIndex - 1]}-${rowIndex}`);
      if (prevColInput) prevColInput.focus();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs select-none cursor-default">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 min-w-[220px]">Mahasiswa</th>
              <th className="py-3 px-3 text-center w-28">
                <div className="flex flex-col items-center">
                  <span>Tugas</span>
                  <span className="text-[10px] text-blue-600 font-bold lowercase">
                    ({weights.tugas}%)
                  </span>
                </div>
              </th>
              <th className="py-3 px-3 text-center w-28">
                <div className="flex flex-col items-center">
                  <span>UTS</span>
                  <span className="text-[10px] text-amber-600 font-bold lowercase">
                    ({weights.uts}%)
                  </span>
                </div>
              </th>
              <th className="py-3 px-3 text-center w-28">
                <div className="flex flex-col items-center">
                  <span>UAS</span>
                  <span className="text-[10px] text-purple-600 font-bold lowercase">
                    ({weights.uas}%)
                  </span>
                </div>
              </th>
              <th className="py-3 px-3 text-center w-28">Nilai Akhir</th>
              <th className="py-3 px-3 text-center w-20">Huruf</th>
              <th className="py-3 px-4 text-center w-36">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SearchX className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">Tidak ada data mahasiswa</p>
                    <p className="text-xs text-slate-400">
                      Coba ubah kata kunci pencarian atau pilih kelas lain.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((s, idx) => {
                const { score, grade } = calculateFinalGrade(s.tugas, s.uts, s.uas);
                const isSelected = selectedIds.includes(s.id);

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50/70 transition-colors ${isSelected ? "bg-blue-50/40" : ""
                      }`}
                  >
                    {/* Mahasiswa Info (dengan checkbox di dalam kolom nama) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectOne(s.id)}
                          aria-label={`Pilih ${s.name}`}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                        />
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs leading-tight">{s.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">NIM: {s.nim}</p>
                        </div>
                      </div>
                    </td>

                    {/* Input Tugas */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        id={`score-input-tugas-${idx}`}
                        type="number"
                        min={0}
                        max={100}
                        step="any"
                        value={s.tugas !== null ? s.tugas : ""}
                        onChange={(e) => onScoreChange(s.id, "tugas", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx, "tugas")}
                        placeholder="-"
                        className="w-20 px-2 py-1.5 text-center font-bold text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl text-xs hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                      />
                    </td>

                    {/* Input UTS */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        id={`score-input-uts-${idx}`}
                        type="number"
                        min={0}
                        max={100}
                        step="any"
                        value={s.uts !== null ? s.uts : ""}
                        onChange={(e) => onScoreChange(s.id, "uts", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx, "uts")}
                        placeholder="-"
                        className="w-20 px-2 py-1.5 text-center font-bold text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl text-xs hover:border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:bg-white outline-none transition-all"
                      />
                    </td>

                    {/* Input UAS */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        id={`score-input-uas-${idx}`}
                        type="number"
                        min={0}
                        max={100}
                        step="any"
                        value={s.uas !== null ? s.uas : ""}
                        onChange={(e) => onScoreChange(s.id, "uas", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx, "uas")}
                        placeholder="-"
                        className="w-20 px-2 py-1.5 text-center font-bold text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl text-xs hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                      />
                    </td>

                    {/* Nilai Akhir */}
                    <td className="py-3 px-3 text-center font-extrabold text-slate-900 text-sm">
                      {score ?? (
                        <span className="text-slate-300 font-normal">-</span>
                      )}
                    </td>

                    {/* Grade Huruf */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${grade === "A" || grade === "A-"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : grade === "B" || grade === "B+"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : grade === "C" || grade === "C+"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : grade === "-"
                                ? "text-slate-400 font-medium"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                      >
                        {grade}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.status === "Tersimpan"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : s.status === "Perlu remedial"
                            ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80"
                          }`}
                      >
                        {s.status === "Tersimpan" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {s.status === "Perlu remedial" && <AlertCircle className="w-3 h-3 text-rose-600" />}
                        {s.status === "Belum lengkap" && <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{s.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
