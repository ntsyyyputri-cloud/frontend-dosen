"use client";

import { useEffect, useState, useCallback } from "react";
import { lecturerService } from "@/services/lecturerService";
import { LecturerDashboardStats, TeachingClass } from "@/types/dashboard";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

const INITIAL_STATS: LecturerDashboardStats = {
  totalClasses: 0,
  totalStudents: 0,
  pendingGrading: 0,
  aiReportsReady: 0,
  accuracyRubric: "0%",
};

export function useLecturerDashboard() {
  const [classes, setClasses] = useState<TeachingClass[]>([]);
  const [stats, setStats] = useState<LecturerDashboardStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await lecturerService.getDashboard();
      if (res.stats) {
        setStats({
          totalClasses: res.stats.totalClasses ?? 0,
          totalStudents: res.stats.totalStudents ?? 0,
          pendingGrading: res.stats.pendingGrading ?? 0,
          aiReportsReady: res.stats.aiReportsReady ?? 0,
          accuracyRubric: res.stats.accuracyRubric ?? "0%",
        });
      }
      if (res.classes) {
        setClasses(res.classes);
      }
    } catch (err: any) {
      console.warn("Koneksi dashboard backend:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useRealtimeEvents(
    ["attendance_updated", "assignment_submitted", "grade_review_created"],
    () => {
      fetchDashboard();
    }
  );

  return {
    classes,
    stats,
    isLoading,
    fetchDashboard,
  };
}

