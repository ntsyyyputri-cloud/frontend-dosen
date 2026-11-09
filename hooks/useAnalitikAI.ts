"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { aiService } from "@/services/aiService";
import { AnalyticsStats, AIAnalysisData } from "@/types/analytics";

export function useAnalitikAI() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisData | null>(null);

  const loadClassGrades = async (classId: number) => {
    setSelectedClassId(classId);
    try {
      const res = await apiFetch(`/grades/${classId}`);
      setStudents(res.grades || []);
    } catch (err: any) {
      console.warn("Error loading grades:", err.message);
      setStudents([]);
    }
  };

  useEffect(() => {
    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          setSelectedClassId(res.classes[0].id);
          loadClassGrades(res.classes[0].id);
        }
      })
      .catch((err) => console.warn(err.message));
  }, []);

  const stats = useMemo<AnalyticsStats>(() => {
    const total = students.length;
    let sumScore = 0;
    let passCount = 0;
    let remedialCount = 0;
    let sumTugas = 0, countTugas = 0;
    let sumUts = 0, countUts = 0;
    let sumUas = 0, countUas = 0;

    students.forEach((s) => {
      const finalScore = s.final_score !== null ? Number(s.final_score) : null;
      if (finalScore !== null) {
        sumScore += finalScore;
        if (finalScore >= 65) passCount++;
        else remedialCount++;
      } else {
        remedialCount++;
      }
      if (s.tugas !== null) { sumTugas += Number(s.tugas); countTugas++; }
      if (s.uts !== null) { sumUts += Number(s.uts); countUts++; }
      if (s.uas !== null) { sumUas += Number(s.uas); countUas++; }
    });

    return {
      total,
      avgScore: total > 0 ? (sumScore / total).toFixed(1) : "0.0",
      passRate: total > 0 ? Math.round((passCount / total) * 100) : 0,
      passCount,
      remedialCount,
      avgTugas: countTugas > 0 ? (sumTugas / countTugas).toFixed(1) : "0.0",
      avgUts: countUts > 0 ? (sumUts / countUts).toFixed(1) : "0.0",
      avgUas: countUas > 0 ? (sumUas / countUas).toFixed(1) : "0.0",
    };
  }, [students]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handleGenerateAI = async () => {
    if (!selectedClassId) return;
    setGeneratingAI(true);
    try {
      const res = await aiService.generateAnalysis({
        className: selectedClass?.name || selectedClass?.title || "Mata Kuliah",
        totalStudents: stats.total,
        avgScore: Number(stats.avgScore),
        passRate: stats.passRate,
        remedialCount: stats.remedialCount,
      });

      setAiAnalysis({
        strength: res.strength,
        improvement: res.improvement,
        recommendation: res.recommendation,
        source: res.source,
      });
    } catch (err: any) {
      console.warn("AI generation failed:", err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  return {
    classes,
    selectedClassId,
    loadClassGrades,
    students,
    stats,
    selectedClass,
    generatingAI,
    aiAnalysis,
    handleGenerateAI,
  };
}

