"use client";

import React from "react";
import { RoleMode } from "@/types/auth";

interface LoginFooterProps {
  roleMode: RoleMode;
}

export function LoginFooter({ roleMode }: LoginFooterProps) {
  return (
    <>
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          {roleMode === "admin"
            ? "Akses terbatas khusus Administrator resmi Bagian Akademik."
            : "Gunakan akun resmi kampus yang telah diterbitkan oleh Administrator."}
        </p>
      </div>
      <p className="mt-6 text-xs text-slate-400 text-center">
        © 2024–2025 Gradia Academic Intelligence System
      </p>
    </>
  );
}

