"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoImg from "@/public/image/logo.png";
import { LogOut } from "lucide-react";
import { DOSEN_MENU_GROUPS } from "@/constants/navigation";

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath = "/dosen/dashboard" }: SidebarProps) {
  const router = useRouter();
  const [lecturer, setLecturer] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gradia_lecturer");
      if (stored) {
        try {
          setLecturer(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gradia_token");
      localStorage.removeItem("gradia_role");
      localStorage.removeItem("gradia_admin");
      localStorage.removeItem("gradia_lecturer");
      document.cookie = "gradia_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "gradia_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 p-4 sticky top-0 h-screen overflow-y-auto z-20 notranslate" translate="no">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link href="/dosen/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={logoImg}
                alt="Logo Gradia"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">Gradia</h1>
              <p className="text-[10px] text-slate-400">Portal Evaluasi Dosen</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {DOSEN_MENU_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentPath.toLowerCase() === item.href.toLowerCase();

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                        <span translate="no" className="notranslate">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
            {lecturer?.name ? lecturer.name[0] : "D"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 text-xs truncate">
              {lecturer?.name || "Dosen Pengampu"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              NIDN: {lecturer?.nidn || "1234567890"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
