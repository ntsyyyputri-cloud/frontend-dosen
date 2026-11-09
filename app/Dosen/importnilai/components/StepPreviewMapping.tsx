"use client";

import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { ImportPreviewRow, UploadedFileInfo } from "@/types/importNilai";

interface StepPreviewMappingProps {
  uploadedFile: UploadedFileInfo | null;
  previewData: ImportPreviewRow[];
  onBack: () => void;
  onProceed: () => void;
  isProcessing: boolean;
}

export function StepPreviewMapping({
  uploadedFile,
  previewData,
  onBack,
  onProceed,
  isProcessing,
}: StepPreviewMappingProps) {
  return (
    <div className="space-y-6">
      {/* File summary */}
      {uploadedFile && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">File: </span>
            <strong className="text-slate-900">{uploadedFile.name}</strong> ({uploadedFile.size})
          </div>
          <div>
            <span className="text-slate-400">Total Baris: </span>
            <strong className="text-indigo-600">{uploadedFile.rows} Mahasiswa</strong>
          </div>
          <div>
            <span className="text-slate-400">Waktu Upload: </span>
            <span className="text-slate-600 font-semibold">{uploadedFile.uploadedAt} WIB</span>
          </div>
        </div>
      )}

      {/* Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">Nama Mahasiswa</th>
                <th className="py-3 px-4 text-center">Tugas (25%)</th>
                <th className="py-3 px-4 text-center">UTS (35%)</th>
                <th className="py-3 px-4 text-center">UAS (40%)</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-400">{idx + 1}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{row.nim}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{row.name}</td>
                  <td className="py-2.5 px-4 text-center">{row.tugas}</td>
                  <td className="py-2.5 px-4 text-center">{row.uts}</td>
                  <td className="py-2.5 px-4 text-center">{row.uas}</td>
                  <td className="py-2.5 px-4 text-center font-bold text-indigo-600">
                    {row.finalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali Unggah Ulang</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onProceed}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isProcessing ? "Menganalisis AI..." : "Lanjutkan & Generate AI"}</span>
        </button>
      </div>
    </div>
  );
}

