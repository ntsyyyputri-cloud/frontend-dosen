import React from "react";
import { LecturerData } from "@/types/lecturer";
import { SharedResetPasswordModal } from "@/components/admin/ResetPasswordModal";

interface ResetPasswordModalProps {
  target: LecturerData | null;
  isResetting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResetPasswordModal({
  target,
  isResetting,
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  return (
    <SharedResetPasswordModal
      isOpen={Boolean(target)}
      accountTypeLabel="akun dosen"
      accountInfo={
        target
          ? {
              title: target.fullName,
              subtitle: `NIDN: ${target.nidn} • ${target.email}`,
            }
          : null
      }
      isResetting={isResetting}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
