"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoImg from "@/public/image/logo.png";
import { LogOut } from "lucide-react";
import { ADMIN_MENU_GROUPS } from "@/constants/navigation";

export interface AdminSidebarProps {
  currentPath?: string;
}

export default function AdminSidebar({ currentPath = "/admin/dashboard" }: AdminSidebarProps) {
  const router = useRouter();
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
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
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
              <h1 className="font-bold text-sm text-slate-900 leading-none">Gradia</h1>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Portal Administrator</p>
            </div>
          </Link>
          <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">
            Admin
          </span>
        </div>

        {/* Navigation Menus */}
        <nav className="space-y-4">
          {ADMIN_MENU_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath.toLowerCase() === item.href.toLowerCase();

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-200"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : "text-slate-400"
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

      {/* Footer Profile & Logout */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
        <div className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {adminUser?.name?.[0] || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-800 text-xs truncate leading-none">
              {adminUser?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-amber-600 truncate mt-0.5 font-medium">
              Hak Akses Penuh
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}

