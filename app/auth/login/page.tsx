"use client";

import React from "react";
import { useLogin } from "@/hooks/useLogin";
import {
  LoginHeader,
  RoleSwitcher,
  LoginForm,
  LoginFooter,
} from "./components";

export default function LoginPage() {
  const {
    roleMode,
    setRoleMode,
    showPassword,
    setShowPassword,
    isLoading,
    errorMsg,
    formData,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        {/* Brand & Header */}
        <LoginHeader roleMode={roleMode} />

        {/* Tab Switcher Button Dosen & Admin */}
        <RoleSwitcher roleMode={roleMode} onRoleChange={setRoleMode} />

        {/* Login Form with inputs and submit */}
        <LoginForm
          roleMode={roleMode}
          formData={formData}
          showPassword={showPassword}
          isLoading={isLoading}
          errorMsg={errorMsg}
          onChange={handleChange}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          onSubmit={handleSubmit}
        />

        {/* Footer Info */}
        <LoginFooter roleMode={roleMode} />
      </div>
    </div>
  );
}
