"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export default function Toast({ show, message, type = "success", onClose }: ToastProps) {
  if (!show || !message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
      {type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
      {type === "info" && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

