"use client";

import React from "react";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";

interface OfficialReportDocumentProps {
  currentClass: any;
  lecturerDisplayName: string;
  lecturer: any;
  grades: any[];
  isLoading: boolean;
}

export function OfficialReportDocument({
  currentClass,
  lecturerDisplayName,
  lecturer,
  grades,
  isLoading,
}: OfficialReportDocumentProps) {
  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 space-y-6">
      {/* KOP SURAT RESMI UNIVERSITAS */}
      <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
        <div className="w-16 h-16 shrink-0 relative">
          <Image
            src={logoImg}
            alt="Logo Universitas"
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center flex-1">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-800">
            KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </h2>
          <h1 className="text-base font-black tracking-tight text-slate-950 uppercase mt-0.5">
            SISTEM INFORMASI AKADEMIK GRADIA
          </h1>
          <p className="text-[10px] text-slate-600 mt-0.5">
            Kampus Terpadu Siber & Teknologi Indonesia • Jl. Pendidikan No. 1, Gedung Rektorat Lt. 2
          </p>
          <p className="text-[10px] font-semibold text-slate-700 tracking-wide mt-0.5">
            LEMBAR BERITA ACARA DAN REKAPITULASI PENILAIAN HASIL STUDI (OBE)
          </p>
        </div>
        <div className="w-16 h-16 shrink-0 hidden sm:block" />
      </div>

      {/* METADATA KELAS */}
      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-transparent print:border-none print:p-0">
        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-28 text-slate-500">Mata Kuliah</span>
            <span className="font-bold text-slate-900">: {currentClass?.title || currentClass?.name || "-"}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500">Kode Mata Kuliah</span>
            <span className="font-semibold text-slate-800">: {currentClass?.code || "-"}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500">Bobot SKS / Sem</span>
            <span className="font-semibold text-slate-800">: {currentClass?.sks || 3} SKS / Semester {currentClass?.semester || 1}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-28 text-slate-500">Dosen Pengampu</span>
            <span className="font-bold text-slate-900">: {lecturerDisplayName}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500">NIDN</span>
            <span className="font-semibold text-slate-800">: {lecturer?.nidn || "-"}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500">Program Studi</span>
            <span className="font-semibold text-slate-800">: {currentClass?.prodi || "S1 Informatika"}</span>
          </div>
        </div>
      </div>

      {/* TABEL NILAI CETAK */}
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-300">
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-10">No</th>
              <th className="py-2.5 px-3 border-r border-slate-300 w-28">NIM</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Nama Mahasiswa</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16">Tugas</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16">UTS</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16">UAS</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Nilai Akhir</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16">Grade</th>
              <th className="py-2.5 px-3 text-center w-24">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Memuat lembar nilai...
                </td>
              </tr>
            ) : grades.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                  Belum ada rekapitulasi nilai untuk mata kuliah ini.
                </td>
              </tr>
            ) : (
              grades.map((g, idx) => (
                <tr key={g.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">{g.nim}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{g.name}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-200">{g.tugas ?? "-"}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-200">{g.uts ?? "-"}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-200">{g.uas ?? "-"}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-bold text-slate-900">{g.final_score ?? "-"}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-bold text-slate-800">{g.letter_grade ?? "-"}</td>
                  <td className="py-2 px-3 text-center font-medium">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      (g.letter_grade === "A" || g.letter_grade === "A-" || g.letter_grade === "B+" || g.letter_grade === "B")
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-amber-700 bg-amber-50"
                    }`}>
                      {g.letter_grade && ["A", "A-", "B+", "B", "C+", "C"].includes(g.letter_grade) ? "Lulus" : "Remedial"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TANDA TANGAN */}
      <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
        <div>
          <p className="text-slate-500">Mengetahui,</p>
          <p className="font-semibold text-slate-800">Ketua Program Studi</p>
          <div className="h-16" />
          <p className="font-bold underline text-slate-900">Dr. Muhammad Farhan, S.Kom., M.T.</p>
          <p className="text-[10px] text-slate-400">NIP. 198503122010121002</p>
        </div>

        <div>
          <p className="text-slate-500">Dosen Pengampu Mata Kuliah,</p>
          <p className="font-semibold text-slate-800">Fakultas Ilmu Komputer</p>
          <div className="h-16" />
          <p className="font-bold underline text-slate-900">{lecturerDisplayName}</p>
          <p className="text-[10px] text-slate-400">NIDN. {lecturer?.nidn || "0412088901"}</p>
        </div>
      </div>
    </div>
  );
}

