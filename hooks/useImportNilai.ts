"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { apiFetch } from "@/lib/api";
import { aiService } from "@/services/aiService";
import {
  ImportPreviewRow,
  UploadedFileInfo,
  AIClassSummary,
} from "@/types/importNilai";

export function useImportNilai() {
  const [currentStep, setCurrentStep] = useState(1);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreviewRow[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [aiClassSummary, setAiClassSummary] = useState<AIClassSummary | null>(null);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        notify("Format file tidak valid atau kosong.");
        setIsUploading(false);
        return;
      }

      const rows: ImportPreviewRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        if (cols.length >= 5) {
          const nim = cols[0];
          const name = cols[1];
          const tugas = parseFloat(cols[2]) || 0;
          const uts = parseFloat(cols[3]) || 0;
          const uas = parseFloat(cols[4]) || 0;
          const finalScore = parseFloat((tugas * 0.25 + uts * 0.35 + uas * 0.4).toFixed(1));

          rows.push({
            nim,
            name,
            tugas,
            uts,
            uas,
            finalScore,
          });
        }
      }

      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        rows: rows.length,
        uploadedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      });
      setPreviewData(rows);
      setIsUploading(false);
      setCurrentStep(2);
      notify(`Berhasil membaca ${rows.length} baris data nilai!`);
    };
    reader.readAsText(file);
  };

  const handleProcessAI = async () => {
    setIsProcessingAI(true);
    try {
      const withFeedback = previewData.map((row) => ({
        ...row,
        aiFeedback: aiService.generateLocalFeedback(row.name, row.finalScore, row.tugas, row.uts, row.uas),
      }));
      setPreviewData(withFeedback);

      const total = withFeedback.length;
      const sum = withFeedback.reduce((acc, curr) => acc + curr.finalScore, 0);
      const avg = total > 0 ? sum / total : 0;
      const pass = withFeedback.filter((r) => r.finalScore >= 65).length;
      const passRate = total > 0 ? Math.round((pass / total) * 100) : 0;
      const remedial = total - pass;

      const currentClass = classes.find((c) => c.id === selectedClassId);
      const res = await aiService.generateAnalysis({
        className: currentClass?.title || currentClass?.name || "Kelas",
        totalStudents: total,
        avgScore: Number(avg.toFixed(1)),
        passRate,
        remedialCount: remedial,
      });

      setAiClassSummary({
        strength: res.strength,
        improvement: res.improvement,
        recommendation: res.recommendation,
      });

      setCurrentStep(3);
      notify("Analitik AI & Feedback otomatis berhasil diterbitkan!");
    } catch (err: any) {
      notify("Gagal memproses AI: " + err.message);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleLockGrades = async () => {
    if (!selectedClassId) {
      notify("Pilih kelas terlebih dahulu.");
      return;
    }

    try {
      await apiFetch(`/grades/${selectedClassId}`, {
        method: "PUT",
        body: JSON.stringify({
          grades: previewData.map((p, idx) => ({
            id: idx + 1,
            nim: p.nim,
            name: p.name,
            tugas: p.tugas,
            uts: p.uts,
            uas: p.uas,
            aiFeedback: p.aiFeedback,
            status: "Tersimpan",
          })),
        }),
      });

      await apiFetch(`/grades/${selectedClassId}/lock`, { method: "PUT" });
      setIsLocked(true);
      setCurrentStep(4);
      notify("Nilai telah berhasil dikunci & disinkronisasi ke database BAAK!");
    } catch (err: any) {
      notify("Gagal mengunci nilai: " + err.message);
    }
  };

  return {
    currentStep,
    classes,
    selectedClassId,
    setSelectedClassId,
    uploadedFile,
    previewData,
    isLocked,
    isProcessingAI,
    showToast,
    toastMsg,
    isUploading,
    aiClassSummary,
    handleStepChange,
    handleDownloadTemplate,
    handleFileChange,
    handleProcessAI,
    handleLockGrades,
  };
}

