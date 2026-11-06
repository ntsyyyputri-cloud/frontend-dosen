"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { BreadcrumbProps } from "@/types/shared";

export interface AdminHeaderProps extends BreadcrumbProps {}

export default function AdminHeader({
  breadcrumbs = ["Portal", "Sistem Akademik", "Dashboard Administrator"],
}: AdminHeaderProps) {
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gradia_admin");
      if (stored) {
        try {
          setAdminUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-300">&rsaquo;</span>}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? "text-slate-800 font-semibold"
                  : "hover:text-slate-600 transition"
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Stats & Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full text-amber-800 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-semibold">Mode Administrator Kampus</span>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right">
            <p className="font-bold text-slate-800 text-xs leading-none">
              {adminUser?.name || "Administrator Utama"}
            </p>
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">
              Super Admin
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
            {adminUser?.name?.[0] || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}

