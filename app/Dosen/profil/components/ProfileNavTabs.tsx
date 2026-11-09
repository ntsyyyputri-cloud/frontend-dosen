"use client";

import React from "react";
import { User, BookOpen, Bell } from "lucide-react";
import { ProfileTab } from "@/types/profile";

interface ProfileNavTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileNavTabs({
  activeTab,
  onTabChange,
}: ProfileNavTabsProps) {
  const tabs: { label: ProfileTab; icon: any }[] = [
    { label: "Informasi Pribadi & Identitas", icon: User },
    { label: "Beban Mengajar & Akademik", icon: BookOpen },
    { label: "Pengaturan & Notifikasi", icon: Bell },
  ];

  return (
    <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.label;

        return (
          <button
            key={t.label}
            type="button"
            onClick={() => onTabChange(t.label)}
            className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
              isActive
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

