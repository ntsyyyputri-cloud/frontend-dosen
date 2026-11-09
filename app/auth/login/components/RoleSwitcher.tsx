"use client";

import React from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { RoleMode } from "@/types/auth";

interface RoleSwitcherProps {
  roleMode: RoleMode;
  onRoleChange: (mode: RoleMode) => void;
}

export function RoleSwitcher({ roleMode, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex p-1 mb-6 bg-slate-100 rounded-2xl border border-slate-200/80">
      <button
        type="button"
        onClick={() => onRoleChange("dosen")}
        className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
          roleMode === "dosen"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <GraduationCap className="w-4 h-4" />
        <span>Dosen</span>
      </button>
      <button
        type="button"
        onClick={() => onRoleChange("admin")}
        className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
          roleMode === "admin"
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>Admin</span>
      </button>
    </div>
  );
}

