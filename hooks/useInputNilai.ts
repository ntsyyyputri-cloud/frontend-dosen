"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { gradeService } from "@/services/gradeService";
import { apiFetch } from "@/lib/api";
import {
  GradeStudent,
  GradeResult,
  FilterTab,
  ScoreField,
  StudentStatus,
  WeightConfig,
} from "@/types/grade";

export const DEFAULT_WEIGHTS: WeightConfig = {
  tugas: 25,
  uts: 35,
  uas: 40,
};

export const WEIGHT_PRESETS = [
  { label: "Standar (25% - 35% - 40%)", weights: { tugas: 25, uts: 35, uas: 40 } },
  { label: "Seimbang (30% - 30% - 40%)", weights: { tugas: 30, uts: 30, uas: 40 } },
  { label: "Praktikum (40% - 30% - 30%)", weights: { tugas: 40, uts: 30, uas: 30 } },
  { label: "Teori & Ujian (20% - 40% - 40%)", weights: { tugas: 20, uts: 40, uas: 40 } },
];

export function useInputNilai() {
  const [classes, setClasses] = useState<any[]>([]);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<GradeStudent[]>([]);
  const [weights, setWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [activeTab, setActiveTab] = useState<FilterTab | "Belum lengkap">("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const totalWeight = useMemo(() => {
    return Number(weights.tugas || 0) + Number(weights.uts || 0) + Number(weights.uas || 0);
  }, [weights]);

  const isWeightValid = totalWeight === 100;

  const handleWeightChange = (field: keyof WeightConfig, rawVal: number) => {
    const val = isNaN(rawVal) ? 0 : Math.max(0, Math.min(100, Math.round(rawVal)));
    setWeights((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const applyPresetWeights = (preset: WeightConfig) => {
    setWeights(preset);
    notify(`Bobot diterapkan: Tugas ${preset.tugas}%, UTS ${preset.uts}%, UAS ${preset.uas}%`);
  };

  const calculateFinalGrade = (
    tugas: number | null,
    uts: number | null,
    uas: number | null,
    customWeights?: WeightConfig
  ): GradeResult => {
    if (tugas === null || uts === null || uas === null || uas === undefined) {
      return { score: null, grade: "-" };
    }

    const w = customWeights || weights;
    const wTugas = (w.tugas || 0) / 100;
    const wUts = (w.uts || 0) / 100;
    const wUas = (w.uas || 0) / 100;

    const score = Math.round((Number(tugas) * wTugas + Number(uts) * wUts + Number(uas) * wUas) * 10) / 10;
    let grade = "E";

    if (score >= 85) grade = "A";
    else if (score >= 80) grade = "A-";
    else if (score >= 75) grade = "B+";
    else if (score >= 70) grade = "B";
    else if (score >= 65) grade = "C+";
    else if (score >= 55) grade = "C";
    else if (score >= 45) grade = "D";

    return {
      score: score.toFixed(1),
      grade,
    };
  };

  const loadGradesForClass = (classId: number) => {
    setActiveClassId(classId);
    setSelectedIds([]);

    gradeService
      .getGradesByClass(classId)
      .then((gradeRes) => {
        if (gradeRes.weights) {
          setWeights({
            tugas: Number(gradeRes.weights.tugas) || DEFAULT_WEIGHTS.tugas,
            uts: Number(gradeRes.weights.uts) || DEFAULT_WEIGHTS.uts,
            uas: Number(gradeRes.weights.uas) || DEFAULT_WEIGHTS.uas,
          });
        }
        if (gradeRes.grades) {
          const mapped: GradeStudent[] = gradeRes.grades.map((g: any, idx: number) => ({
            id: g.enrollment_id || idx + 1,
            nim: g.nim,
            name: g.name,
            type: `${g.prodi || "Teknik Informatika"} - Reguler`,
            avatar: (g.name || "M").substring(0, 2).toUpperCase(),
            tugas: g.tugas,
            uts: g.uts,
            uas: g.uas,
            aiFeedback: g.ai_feedback || "",
            status: (g.status as StudentStatus) || "Belum lengkap",
          }));
          setStudents(mapped);
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat rekap nilai:", err.message);
        notify("Gagal memuat data nilai kelas.");
      });
  };

  useEffect(() => {
    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          const firstClassId = res.classes[0].id;
          loadGradesForClass(firstClassId);
        }
      })
      .catch((err) => console.warn("Gagal memuat daftar kelas:", err.message));
  }, []);

  const handleSaveGrades = async () => {
    if (!activeClassId) {
      notify("Silakan pilih kelas terlebih dahulu!");
      return;
    }
    if (!isWeightValid) {
      notify(`Peringatan: Total bobot saat ini ${totalWeight}%. Disarankan total 100% agar perhitungan OBE valid.`);
    }
    setIsSaving(true);
    try {
      await gradeService.saveGrades(activeClassId, students, weights);
      notify("Rekap nilai & bobot penilaian berhasil disimpan!");
      // reload to refresh sync
      loadGradesForClass(activeClassId);
    } catch (err: any) {
      notify("Gagal menyimpan rekap nilai: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleScoreChange = (id: number, field: ScoreField, val: string) => {
    let num: number | null = val === "" ? null : parseFloat(val);
    if (num !== null) {
      if (isNaN(num)) num = null;
      else if (num < 0) num = 0;
      else if (num > 100) num = 100;
    }

    setStudents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated: GradeStudent = {
          ...item,
          [field]: num,
        };

        if (updated.tugas !== null && updated.uts !== null && updated.uas !== null) {
          const { score } = calculateFinalGrade(updated.tugas, updated.uts, updated.uas);
          if (score !== null && parseFloat(score) < 65) {
            updated.status = "Perlu remedial";
          } else {
            updated.status = "Tersimpan";
          }
        } else {
          updated.status = "Belum lengkap";
        }

        return updated;
      })
    );
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuickFillSelected = (field: ScoreField, scoreVal: number) => {
    if (selectedIds.length === 0) {
      notify("Pilih minimal 1 mahasiswa terlebih dahulu.");
      return;
    }
    setStudents((prev) =>
      prev.map((s) => {
        if (!selectedIds.includes(s.id)) return s;
        const updated = { ...s, [field]: scoreVal };
        if (updated.tugas !== null && updated.uts !== null && updated.uas !== null) {
          const { score } = calculateFinalGrade(updated.tugas, updated.uts, updated.uas);
          updated.status = score !== null && parseFloat(score) < 65 ? "Perlu remedial" : "Tersimpan";
        } else {
          updated.status = "Belum lengkap";
        }
        return updated;
      })
    );
    notify(`Berhasil mengisi ${field.toUpperCase()} = ${scoreVal} untuk ${selectedIds.length} mahasiswa.`);
  };

  const handleClearSelected = () => {
    if (selectedIds.length === 0) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (!selectedIds.includes(s.id)) return s;
        return {
          ...s,
          tugas: null,
          uts: null,
          uas: null,
          status: "Belum lengkap",
        };
      })
    );
    notify(`Nilai ${selectedIds.length} mahasiswa berhasil dikosongkan.`);
  };

  const counts = useMemo(() => {
    let lulus = 0;
    let remedial = 0;
    let belumLengkap = 0;

    students.forEach((s) => {
      const { score } = calculateFinalGrade(s.tugas, s.uts, s.uas);
      if (score === null) {
        belumLengkap++;
      } else if (parseFloat(score) >= 65) {
        lulus++;
      } else {
        remedial++;
      }
    });

    return {
      semua: students.length,
      lulus,
      remedial,
      belumLengkap,
    };
  }, [students, weights]);

  const filteredStudents = useMemo<GradeStudent[]>(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nim.includes(searchQuery);

      const { score } = calculateFinalGrade(student.tugas, student.uts, student.uas);
      const isLulus = score !== null && parseFloat(score) >= 65;
      const isRemedial = score !== null && parseFloat(score) < 65;
      const isBelumLengkap = score === null;

      if (activeTab === "Lulus") return matchSearch && isLulus;
      if (activeTab === "Remedial") return matchSearch && isRemedial;
      if (activeTab === "Belum lengkap") return matchSearch && isBelumLengkap;
      return matchSearch;
    });
  }, [students, searchQuery, activeTab, weights]);

  const averages = useMemo(() => {
    let sumTugas = 0, countTugas = 0;
    let sumUts = 0, countUts = 0;
    let sumUas = 0, countUas = 0;
    let sumFinal = 0, countFinal = 0;

    students.forEach((student) => {
      if (student.tugas !== null) { sumTugas += student.tugas; countTugas++; }
      if (student.uts !== null) { sumUts += student.uts; countUts++; }
      if (student.uas !== null) { sumUas += student.uas; countUas++; }

      const { score } = calculateFinalGrade(student.tugas, student.uts, student.uas);
      if (score !== null) {
        sumFinal += parseFloat(score);
        countFinal++;
      }
    });

    return {
      tugas: countTugas ? (sumTugas / countTugas).toFixed(1) : "-",
      uts: countUts ? (sumUts / countUts).toFixed(1) : "-",
      uas: countUas ? (sumUas / countUas).toFixed(1) : "-",
      final: countFinal ? (sumFinal / countFinal).toFixed(1) : "-",
    };
  }, [students, weights]);

  return {
    classes,
    activeClassId,
    students,
    weights,
    totalWeight,
    isWeightValid,
    handleWeightChange,
    applyPresetWeights,
    loadGradesForClass,
    handleSaveGrades,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleScoreChange,
    handleQuickFillSelected,
    handleClearSelected,
    calculateFinalGrade,
    filteredStudents,
    averages,
    counts,
    showToast,
    toastMessage,
    isSaving,
    notify,
  };
}
