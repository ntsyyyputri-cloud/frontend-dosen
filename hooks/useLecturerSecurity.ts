"use client";

import { useState, type FormEvent } from "react";
import { lecturerService } from "@/services/lecturerService";

export function useLecturerSecurity() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setToastMsg("Semua kolom kata sandi wajib diisi.");
      setIsError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMsg("Konfirmasi kata sandi baru tidak cocok.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await lecturerService.updatePassword({ oldPassword, newPassword });
      setToastMsg("Kata sandi berhasil diperbarui dengan aman.");
      setIsError(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setToastMsg(err.message || "Gagal memperbarui kata sandi.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  return {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    twoFactor,
    setTwoFactor,
    toastMsg,
    isSubmitting,
    isError,
    handlePasswordSubmit,
  };
}

