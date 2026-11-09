"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { apiFetch } from "@/lib/api";
import {
  GradeStudent,
  GradeResult,
  FilterTab,
  ScoreField,
  StudentStatus,
} from "@/types/grade";

const BOBOT = {
  tugas: 0.25,
  uts: 0.35,
  uas: 0.4,
};

export function useInputNilai() {
  const [classes, setClasses] = useState<any[]>([]);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<GradeStudent[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const calculateFinalGrade = (
    tugas: number | null,
    uts: number | null,
    uas: number | null
  ): GradeResult => {
    if (tugas === null || uts === null || uas === null || uas === undefined) {
      return { score: null, grade: "-" };
    }

    const score = tugas * BOBOT.tugas + uts * BOBOT.uts + uas * BOBOT.uas;
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
    apiFetch(`/grades/${classId}`)
      .then((gradeRes) => {
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
            aiFeedback: g.ai_feedback || "Belum ada feedback AI",
            status: (g.status as StudentStatus) || "Belum lengkap",
          }));
          setStudents(mapped);
        }
      })
      .catch((err) => console.warn(err.message));
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
      .catch((err) => console.warn(err.message));
  }, []);

  const handleSaveGrades = async () => {
    if (!activeClassId) {
      notify("Silakan pilih kelas terlebih dahulu!");
      return;
    }
    setIsSaving(true);
    try {
      await apiFetch(`/grades/${activeClassId}`, {
        method: "PUT",
        body: JSON.stringify({ grades: students }),
      });
      notify("Data rekap nilai berhasil disimpan ke sistem!");
    } catch (err: any) {
      notify("Gagal menyimpan rekap nilai: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleScoreChange = (id: number, field: ScoreField, val: string) => {
    const num: number | null = val === "" ? null : parseFloat(val);

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

  const filteredStudents = useMemo<GradeStudent[]>(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nim.includes(searchQuery);

      const { score } = calculateFinalGrade(student.tugas, student.uts, student.uas);
      const isLulus = score !== null && parseFloat(score) >= 65;
      const isRemedial = student.status === "Perlu remedial";

      if (activeTab === "Lulus") return matchSearch && isLulus;
      if (activeTab === "Remedial") return matchSearch && isRemedial;
      return matchSearch;
    });
  }, [students, searchQuery, activeTab]);

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
  }, [students]);

  return {
    classes,
    activeClassId,
    students,
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
    calculateFinalGrade,
    filteredStudents,
    averages,
    showToast,
    toastMessage,
    isSaving,
    notify,
  };
}

