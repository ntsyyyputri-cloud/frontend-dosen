"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { RoleMode, LoginFormData } from "@/types/auth";

export function useLogin() {
  const router = useRouter();

  const [roleMode, setRoleMode] = useState<RoleMode>("dosen");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  // Deteksi query param ?role=admin atau ?role=dosen dari URL saat pertama kali dibuka
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role")?.toLowerCase();
      if (roleParam === "admin") {
        setRoleMode("admin");
      } else if (roleParam === "dosen") {
        setRoleMode("dosen");
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (mode: RoleMode) => {
    setRoleMode(mode);
    setErrorMsg("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (!formData.identifier.trim() || !formData.password) {
        setErrorMsg(
          roleMode === "admin"
            ? "Username / Email Administrator dan kata sandi wajib diisi."
            : "NIDN / Email Kampus dan kata sandi wajib diisi."
        );
        setIsLoading(false);
        return;
      }

      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password,
        }),
      });

      const rawRole = (res.role || "dosen").toLowerCase();
      const detectedRole = (rawRole === "admin" || rawRole === "superadmin") ? "admin" : rawRole;

      // Simpan autentikasi ke localStorage & cookie
      localStorage.setItem("gradia_token", res.token);
      localStorage.setItem("gradia_role", detectedRole);

      document.cookie = `gradia_token=${res.token}; path=/; max-age=604800; SameSite=Lax;`;
      document.cookie = `gradia_role=${detectedRole}; path=/; max-age=604800; SameSite=Lax;`;

      // Otomatis arahkan ke dashboard masing-masing role
      if (detectedRole === "admin") {
        localStorage.setItem("gradia_admin", JSON.stringify(res.admin || res.user));
        localStorage.removeItem("gradia_lecturer");
        router.push("/admin/dashboard");
      } else {
        localStorage.setItem("gradia_lecturer", JSON.stringify(res.lecturer || res.user));
        localStorage.removeItem("gradia_admin");
        router.push("/dosen/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      setErrorMsg(
        message ||
          (roleMode === "admin"
            ? "Gagal masuk sebagai Administrator. Periksa username dan kata sandi."
            : "Gagal masuk sebagai Dosen. Periksa NIDN/email dan kata sandi.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    roleMode,
    setRoleMode: handleRoleChange,
    showPassword,
    setShowPassword,
    isLoading,
    errorMsg,
    formData,
    handleChange,
    handleSubmit,
  };
}
