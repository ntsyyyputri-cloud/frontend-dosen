"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import {
AdminWelcomeBanner,
  AdminStatsGrid,
  ProdiDistributionCard,
  RecentClassesCard,
  RecentLecturersCard,
} from "@/components/admin/dashboard";

export default function AdminDashboardPage() {
  const {
    stats,
    prodiDistribution,
    recentLecturers,
    recentClasses,
    isLoading,
    fetchDashboardData,
  } = useAdminDashboard();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      <AdminSidebar currentPath="/Admin/dashboard" />

      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader breadcrumbs={["Portal", "Sistem Akademik", "Dashboard Administrator"]} />

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
            <AdminWelcomeBanner
              isLoading={isLoading}
              onRefresh={fetchDashboardData}
            />

          {/* Statistics Grid */}
            <AdminStatsGrid
              stats={stats}
              isLoading={isLoading}
            />

          {/* Two-Column Section: Distribution & Recent Data */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <ProdiDistributionCard
                  prodiDistribution={prodiDistribution}
                  totalStudents={stats.totalStudents}
                />
              </div>

                <div className="lg:col-span-7">
                  <RecentClassesCard
                    recentClasses={recentClasses}
                  />
                </div>
              </div>

              {/* Recent Lecturers Section */}
              <RecentLecturersCard
                recentLecturers={recentLecturers}
              />
            </div>
          </main>
        </div>
        );
}
