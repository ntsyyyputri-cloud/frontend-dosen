"use client";

import React from "react";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";
import { RoleMode } from "@/types/auth";

interface LoginHeaderProps {
  roleMode: RoleMode;
}

export function LoginHeader({ roleMode }: LoginHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden shadow-xs">
        <Image
          src={logoImg}
          alt="Logo Gradia"
          width={56}
          height={56}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gradia</h1>
      <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
        {roleMode === "admin"
          ? "Pusat Kendali & Administrasi Akademik Kampus"
          : "Portal Evaluasi & Penilaian Akademik Dosen"}
      </p>
    </div>
  );
}

