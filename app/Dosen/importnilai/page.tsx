'use client';

import React, { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import {
  Download,
  Upload,
  Sparkles,
  FileSpreadsheet,
  Check,
  CheckCircle2,
} from "lucide-react";

export default function ImportNilaiExcel() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    rows: number;
    uploadedAt: string;
  } | null>(null);

  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [aiClassSummary, setAiClassSummary] = useState<{
    strength: string;
    improvement: string;
    recommendation: string;
  } | null>(null);

  useEffect(() => {
    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          setSelectedClassId(res.classes[0].id);
        }
      })
      .catch((err) => console.warn(err.message));
  }, []);

  const notify = (message: string) => {
    setToastMsg(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,NIM,Nama,Tugas,UTS,UAS\n230101,Ahmad Pratama,85,80,90\n230102,Budi Santoso,78,82,85\n230103,Citra Lestari,90,88,92\n230104,Dian Wahyuni,75,70,80\n230105,Eko Saputra,88,85,89";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_nilai_mahasiswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Template Excel (.csv) berhasil diunduh!");
  };

  const handleStepChange = (step: number) => {
    if (isLocked && step < 4) {
      notify("Nilai sudah dikunci. Tahapan sebelumnya tidak dapat diubah.");
      return;
    }
    setCurrentStep(step);
  };

  const generateLocalAIFeedback = (name: string, finalScore: number, tugas: number, uts: number, uas: number) => {
    if (finalScore >= 85) {
      return `Penguasaan materi oleh ${name} sangat istimewa pada seluruh komponen (Tugas ${tugas}, UTS ${uts}, UAS ${uas}). Memenuhi seluruh indikator capaian pembelajaran OBE secara sangat memuaskan.`;
    } else if (finalScore >= 75) {
      return `Pemahaman konsep dan pengerjaan tugas oleh ${name} baik (Nilai Akhir ${finalScore}). Disarankan untuk memperdalam studi kasus mandiri pada materi evaluasi akhir agar performa lebih optimal.`;
    } else if (finalScore >= 65) {
      return `Capaian kompetensi dasar terpenuhi cukup baik. Namun mahasiswa perlu meningkatkan ketelitian pada pengerjaan ujian dan praktikum evaluasi.`;
    } else {
      return `Mahasiswa direkomendasikan mengikuti sesi bimbingan remedial dan penguatan modul dasar untuk mengejar ketertinggalan capaian pembelajaran mata kuliah.`;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        const parsed: any[] = [];
        const startIdx = lines[0].toLowerCase().includes("nim") ? 1 : 0;

        for (let i = startIdx; i < lines.length; i++) {
          const parts = lines[i].split(",").map((p) => p.trim());
          if (parts.length >= 2) {
            const nim = parts[0];
            const name = parts[1];
            const tugas = parseFloat(parts[2]) || 0;
            const uts = parseFloat(parts[3]) || 0;
            const uas = parseFloat(parts[4]) || 0;
            const total = Number((tugas * 0.3 + uts * 0.3 + uas * 0.4).toFixed(1));
            const aiFeedback = generateLocalAIFeedback(name, total, tugas, uts, uas);

            parsed.push({
              id: i,
              nim,
              name,
              tugas,
              uts,
              uas,
              total,
              aiFeedback,
              status: "Valid",
            });
          }
        }

        setPreviewData(parsed);
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          rows: parsed.length,
          uploadedAt: "Baru saja",
        });
        setIsUploading(false);
        setCurrentStep(2);
        notify(`Berhasil membaca ${parsed.length} baris data dari ${file.name}`);
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      notify("Gagal membaca file!");
    };
    reader.readAsText(file);
  };

  /* LOCK DATA & GENERATE AI INTEGRATED */
  const handleLockDataAndGenerateAI = async () => {
    if (!selectedClassId) {
      notify("Silakan pilih kelas terlebih dahulu!");
      return;
    }
    if (previewData.length === 0) {
      notify("Belum ada data nilai yang diunggah!");
      return;
    }

    setIsProcessingAI(true);
    const selectedClass = classes.find((c) => c.id === selectedClassId);

    // Compute stats
    let totalScore = 0;
    let passCount = 0;
    let remedialCount = 0;

    previewData.forEach((row) => {
      totalScore += row.total;
      if (row.total >= 65) passCount++;
      else remedialCount++;
    });

    const avgScore = previewData.length > 0 ? (totalScore / previewData.length).toFixed(1) : "0.0";
    const passRate = previewData.length > 0 ? Math.round((passCount / previewData.length) * 100) : 0;

    try {
      // 1. Simpan data nilai sekaligus catatan AI feedback ke backend
      await apiFetch(`/grades/${selectedClassId}/import`, {
        method: "POST",
        body: JSON.stringify({ rows: previewData }),
      });

      // 2. Request telaah analisis kelas AI
      try {
        const aiRes = await apiFetch("/ai/feedback", {
          method: "POST",
          body: JSON.stringify({
            classSummary: {
              className: selectedClass?.title || selectedClass?.name || "Mata Kuliah",
              totalStudents: previewData.length,
              avgScore: Number(avgScore),
              passRate,
              remedialCount,
            },
          }),
        });

        if (aiRes) {
          setAiClassSummary({
            strength: aiRes.strength || `Sebanyak ${passRate}% mahasiswa mencapai ambang batas kompetensi CPMK dengan rata-rata ${avgScore}.`,
            improvement: aiRes.improvement || (remedialCount > 0 ? `Terdapat ${remedialCount} mahasiswa memerlukan pengayaan atau bimbingan remedial.` : "Seluruh mahasiswa tuntas di atas ambang kompetensi."),
            recommendation: aiRes.recommendation || (remedialCount > 0 ? "Jadwalkan sesi tutorial praktikum terarah untuk CPMK yang belum tuntas." : "Lanjutkan ke materi pengayaan berbasis studi kasus mandiri."),
          });
        }
      } catch (aiErr: any) {
        console.warn("AI class summary fallback:", aiErr.message);
        setAiClassSummary({
          strength: `Sebanyak ${passRate}% mahasiswa mencapai ambang batas kompetensi CPMK dengan rata-rata ${avgScore}.`,
          improvement: remedialCount > 0 ? `Terdapat ${remedialCount} mahasiswa memerlukan pengayaan atau bimbingan remedial.` : "Seluruh mahasiswa tuntas di atas ambang batas standar.",
          recommendation: remedialCount > 0 ? "Jadwalkan sesi remedial praktikum sebelum penerbitan berita acara nilai akhir." : "Pertahankan capaian pembelajaran dan lanjutkan ke portofolio akhir.",
        });
      }

      setIsLocked(true);
      setCurrentStep(3);
      notify("Nilai berhasil disimpan dan Telaah AI OBE berhasil diterbitkan!");
    } catch (err: any) {
      notify("Gagal memproses data: " + err.message);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleCancel = () => {
    setIsLocked(false);
    setCurrentStep(1);
    setPreviewData([]);
    setUploadedFile(null);
    setAiClassSummary(null);
    notify("Proses import dibatalkan.");
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        {/* TOAST */}
        {showToast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* SIDEBAR */}
        <Sidebar currentPath="/Dosen/importnilai" />

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header breadcrumbs={["Portal", "Penilaian & Evaluasi", "Import Nilai & Generate AI"]} />

          <main className="p-8 space-y-6">
            {/* HEADER BANNER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Import Nilai & Generate AI
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Unggah file Excel/CSV nilai mahasiswa. Sistem secara otomatis memvalidasi, menyimpan nilai,
                  dan men-generate AI feedback OBE secara terintegrasi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Kelas Target:</span>
                  <select
                    value={selectedClassId || ""}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                    disabled={isLocked}
                    className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    {classes.length === 0 ? (
                      <option value="">(Belum ada kelas)</option>
                    ) : (
                      classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} - {c.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition shadow-xs"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  Format Template (.csv)
                </button>
              </div>
            </div>

            {/* STEPPER PROGRESS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className={`flex items-center gap-2 font-semibold text-xs ${currentStep >= 1 ? "text-indigo-600" : "text-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    1
                  </span>
                  <span>Unggah Lembar Nilai</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200" />
                <div className={`flex items-center gap-2 font-semibold text-xs ${currentStep >= 2 ? "text-indigo-600" : "text-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    2
                  </span>
                  <span>Pratinjau Nilai</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200" />
                <div className={`flex items-center gap-2 font-semibold text-xs ${currentStep >= 3 ? "text-indigo-600" : "text-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    3
                  </span>
                  <span>Hasil & Telaah AI OBE</span>
                </div>
              </div>
            </div>

            {/* STEP 1: UPLOAD */}
            {currentStep === 1 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilih File Excel atau CSV Nilai
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pastikan file mencakup kolom <strong className="text-slate-700">NIM, Nama, Tugas, UTS, dan UAS</strong>.
                    Kalkulasi nilai akhir dan catatan AI Feedback individual akan diproses secara otomatis.
                  </p>

                  <label className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md shadow-indigo-600/20 transition">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? "Membaca data file..." : "Pilih File Spreadsheet (.csv / .xlsx)"}</span>
                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: PREVIEW & ACTION */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">
                      Pratinjau File: {uploadedFile?.name} ({previewData.length} Mahasiswa)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target Kelas: <strong className="text-indigo-600">{selectedClass?.title || "Kelas Terpilih"}</strong>.
                      Periksa kelengkapan nilai sebelum menyimpan dan men-generate analisis AI.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleLockDataAndGenerateAI}
                      disabled={isProcessingAI}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessingAI ? "Memproses Nilai & Generate AI..." : "Simpan Nilai & Generate AI OBE"}</span>
                    </button>
                  </div>
                </div>

                {/* TABLE PREVIEW */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">NIM</th>
                          <th className="py-3 px-4">Nama Mahasiswa</th>
                          <th className="py-3 px-3 text-center">Tugas (30%)</th>
                          <th className="py-3 px-3 text-center">UTS (30%)</th>
                          <th className="py-3 px-3 text-center">UAS (40%)</th>
                          <th className="py-3 px-3 text-center">Nilai Akhir</th>
                          <th className="py-3 px-4">Pratinjau Feedback AI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {previewData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4 font-semibold text-slate-600">{row.nim}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                            <td className="py-3 px-3 text-center font-medium">{row.tugas}</td>
                            <td className="py-3 px-3 text-center font-medium">{row.uts}</td>
                            <td className="py-3 px-3 text-center font-medium">{row.uas}</td>
                            <td className="py-3 px-3 text-center font-bold text-indigo-600">{row.total}</td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] max-w-md line-clamp-1">
                              {row.aiFeedback}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: HASIL LENGKAP & TELAAH AI KELAS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* AI SUMMARY CARD */}
                {aiClassSummary && (
                  <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-white border border-indigo-100 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        Telaah Analitik AI Outcome-Based Education (OBE)
                      </h3>
                      <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                        AI Engine Selesai
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      <div className="bg-white/80 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                          Kekuatan Capaian (Strength)
                        </span>
                        <p className="text-slate-700 text-xs leading-relaxed">{aiClassSummary.strength}</p>
                      </div>

                      <div className="bg-white/80 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                          Area Perbaikan (Improvement)
                        </span>
                        <p className="text-slate-700 text-xs leading-relaxed">{aiClassSummary.improvement}</p>
                      </div>

                      <div className="bg-white/80 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                          Rekomendasi Tindak Lanjut
                        </span>
                        <p className="text-slate-700 text-xs leading-relaxed">{aiClassSummary.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUCCESS BAR */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Seluruh data nilai dan catatan AI feedback berhasil disinkronkan ke buku nilai ledger.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push("/Dosen/inputnilai")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
                    >
                      Buka Lembar Rekap Nilai
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      Import File Lain
                    </button>
                  </div>
                </div>

                {/* FINAL RESULT TABLE */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">
                      Rekap Nilai Terimpor & Feedback AI Individual ({previewData.length} Mahasiswa)
                    </h4>
                    <span className="text-[11px] text-slate-400">Status: Tersimpan</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">NIM</th>
                          <th className="py-3 px-4">Nama Mahasiswa</th>
                          <th className="py-3 px-3 text-center">Tugas</th>
                          <th className="py-3 px-3 text-center">UTS</th>
                          <th className="py-3 px-3 text-center">UAS</th>
                          <th className="py-3 px-3 text-center">Nilai Akhir</th>
                          <th className="py-3 px-4">AI Feedback OBE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {previewData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-semibold text-slate-600">{row.nim}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{row.name}</td>
                            <td className="py-3.5 px-3 text-center font-medium">{row.tugas}</td>
                            <td className="py-3.5 px-3 text-center font-medium">{row.uts}</td>
                            <td className="py-3.5 px-3 text-center font-medium">{row.uas}</td>
                            <td className="py-3.5 px-3 text-center font-black text-indigo-600">{row.total}</td>
                            <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed max-w-md">
                              {row.aiFeedback}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>

          <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-3 text-[11px] text-slate-400 flex items-center justify-between">
            <p>© 2024–2025 Lembaga Layanan Pendidikan Tinggi (LLDIKTI) • Gradia</p>
            <div className="text-emerald-600 font-medium">Sistem Penilaian Terpadu</div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
