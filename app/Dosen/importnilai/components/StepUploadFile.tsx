"use client";

import React, { type ChangeEvent } from "react";
import { Download, Upload, FileSpreadsheet } from "lucide-react";

interface StepUploadFileProps {
  classes: any[];
  selectedClassId: number | null;
  onClassChange: (id: number) => void;
  onDownloadTemplate: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function StepUploadFile({
  classes,
  selectedClassId,
  onClassChange,
  onDownloadTemplate,
  onFileChange,
  isUploading,
}: StepUploadFileProps) {
  return (
    <div className="space-y-6">
      {/* Class selector & template download */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Pilih Target Kelas / Rombongan Belajar:
          </label>
          <select
            value={selectedClassId || ""}
            onChange={(e) => onClassChange(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none w-full sm:w-80"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code || "KLS"} - {c.title || c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onDownloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Unduh Template CSV</span>
        </button>
      </div>

      {/* Upload Drag/Drop Box */}
      <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 text-center transition-all">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Unggah File Nilai Mahasiswa
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Format file didukung: .csv atau .xlsx yang sesuai dengan template kolom sistem (NIM, Nama, Tugas, UTS, UAS).
        </p>

        <label className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer transition-all">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? "Membaca Berkas..." : "Pilih File Dari Komputer"}</span>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={onFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

