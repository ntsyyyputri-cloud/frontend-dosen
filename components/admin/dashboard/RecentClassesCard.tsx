"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecentClass } from "@/types/admin";

export interface RecentClassesCardProps {
  recentClasses: RecentClass[];
}

export default function RecentClassesCard({ recentClasses }: RecentClassesCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">
            Kelas Perkuliahan Terbaru
          </h2>
          <p className="text-slate-400 text-[11px]">5 kelas terakhir yang dibuat di sistem</p>
        </div>
        <Link
          href="/Admin/kelas"
          className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
              <th className="pb-3">Kode & Mata Kuliah</th>
              <th className="pb-3">Dosen Pengampu</th>
              <th className="pb-3">Prodi</th>
              <th className="pb-3 text-right">Mahasiswa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentClasses.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                  Belum ada data kelas perkuliahan.
                </td>
              </tr>
            ) : (
              recentClasses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 pr-2">
                    <span className="font-bold text-slate-800 block text-xs">{c.title}</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      {c.code} • {c.sks} SKS
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-700 font-medium text-xs">
                    {c.lecturer_name}
                  </td>
                  <td className="py-3 px-2 text-slate-500 text-xs">{c.prodi}</td>
                  <td className="py-3 pl-2 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {c.enrolled_count} Mhs
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

