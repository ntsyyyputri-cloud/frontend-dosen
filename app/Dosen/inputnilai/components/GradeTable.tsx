"use client";

import React, { type ChangeEvent } from "react";
import { Sparkles } from "lucide-react";
import { GradeStudent, GradeResult, ScoreField } from "@/types/grade";

interface GradeTableProps {
  students: GradeStudent[];
  selectedIds: number[];
  onSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
  onScoreChange: (id: number, field: ScoreField, val: string) => void;
  calculateFinalGrade: (t: number | null, u: number | null, a: number | null) => GradeResult;
}

export function GradeTable({
  students,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onScoreChange,
  calculateFinalGrade,
}: GradeTableProps) {
  const isAllSelected = students.length > 0 && selectedIds.length === students.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="py-3 px-4">Mahasiswa</th>
              <th className="py-3 px-3 text-center w-24">Tugas (25%)</th>
              <th className="py-3 px-3 text-center w-24">UTS (35%)</th>
              <th className="py-3 px-3 text-center w-24">UAS (40%)</th>
              <th className="py-3 px-3 text-center w-24">Nilai Akhir</th>
              <th className="py-3 px-3 text-center w-16">Huruf</th>
              <th className="py-3 px-4">Rekomendasi AI</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                  Belum ada data nilai mahasiswa di kelas ini.
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const { score, grade } = calculateFinalGrade(s.tugas, s.uts, s.uas);
                const isSelected = selectedIds.includes(s.id);

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50/50 transition-colors ${
                      isSelected ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectOne(s.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{s.name}</p>
                          <p className="text-[10px] text-slate-400">NIM: {s.nim}</p>
                        </div>
                      </div>
                    </td>

                    {/* Input Tugas */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.tugas !== null ? s.tugas : ""}
                        onChange={(e) => onScoreChange(s.id, "tugas", e.target.value)}
                        placeholder="-"
                        className="w-16 px-2 py-1 text-center font-semibold bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
                      />
                    </td>

                    {/* Input UTS */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.uts !== null ? s.uts : ""}
                        onChange={(e) => onScoreChange(s.id, "uts", e.target.value)}
                        placeholder="-"
                        className="w-16 px-2 py-1 text-center font-semibold bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
                      />
                    </td>

                    {/* Input UAS */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.uas !== null ? s.uas : ""}
                        onChange={(e) => onScoreChange(s.id, "uas", e.target.value)}
                        placeholder="-"
                        className="w-16 px-2 py-1 text-center font-semibold bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
                      />
                    </td>

                    {/* Nilai Akhir */}
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {score ?? "-"}
                    </td>

                    {/* Grade Huruf */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          grade === "A" || grade === "A-"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : grade === "B" || grade === "B+"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : grade === "C" || grade === "C+"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : grade === "-"
                            ? "text-slate-400"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {grade}
                      </span>
                    </td>

                    {/* Feedback AI */}
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                        <span className="truncate">{s.aiFeedback}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          s.status === "Tersimpan"
                            ? "bg-emerald-50 text-emerald-700"
                            : s.status === "Perlu remedial"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.status}
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

