"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { AdminStats, ProdiStat, RecentLecturer, RecentClass } from "@/types/admin";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalLecturers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalGradesSubmitted: 0,
  });
  const [prodiDistribution, setProdiDistribution] = useState<ProdiStat[]>([]);
  const [recentLecturers, setRecentLecturers] = useState<RecentLecturer[]>([]);
  const [recentClasses, setRecentClasses] = useState<RecentClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await adminService.getStats();
      if (res.stats) setStats(res.stats);
      if (res.prodiDistribution) setProdiDistribution(res.prodiDistribution);
      if (res.recentLecturers) setRecentLecturers(res.recentLecturers);
      if (res.recentClasses) setRecentClasses(res.recentClasses);
    } catch (err: any) {
      console.warn("Gagal mengambil data statistik admin:", err.message);
      setErrorMsg(err.message || "Gagal memuat statistik admin");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    prodiDistribution,
    recentLecturers,
    recentClasses,
    isLoading,
    errorMsg,
    fetchDashboardData,
  };
}

