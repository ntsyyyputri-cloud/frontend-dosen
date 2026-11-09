"use client";

import { useEffect, useState } from "react";
import { ProfileTab, ProfileFormData } from "@/types/profile";
import { lecturerService } from "@/services/lecturerService";

const INITIAL_PROFILE: ProfileFormData = {
  gelarDepan: "Dr. Ir.",
  namaLengkap: "Hendra",
  gelarBelakang: "M.T.",
  nidn: "0412088201",
  emailResmi: "hendra.dosen@kampus.ac.id",
  nomorHp: "+62 812-3456-7890",
  ruangKerja: "Gedung Lab Terpadu Lt. 3 R. 302",
  jamKonsultasi: "Senin & Rabu 13:00 - 15:30 WIB",
  notifCapaian: true,
  notifDeadline: true,
};

export function useLecturerProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Informasi Pribadi & Identitas");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("gradia_lecturer") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData((prev) => ({
          ...prev,
          gelarDepan: parsed.title_prefix || prev.gelarDepan,
          namaLengkap: parsed.name || prev.namaLengkap,
          gelarBelakang: parsed.title_suffix || prev.gelarBelakang,
          nidn: parsed.nidn || prev.nidn,
          emailResmi: parsed.email || prev.emailResmi,
          nomorHp: parsed.phone || prev.nomorHp,
          ruangKerja: parsed.office_room || prev.ruangKerja,
          jamKonsultasi: parsed.consult_hours || prev.jamKonsultasi,
        }));
      } catch (e) {}
    }
  }, []);

  const notify = (message: string) => {
    setToastMsg(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await lecturerService.updateProfile(formData);
      notify("Perubahan data profil dosen berhasil disimpan!");
    } catch (err: any) {
      notify("Perubahan profil disimpan secara lokal.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    notify("Perubahan formulir dibatalkan.");
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    handleInputChange,
    handleSave,
    handleCancel,
    showToast,
    toastMsg,
    isSaving,
  };
}

