"use server";

import { adminActionClient } from "@/lib/safe-action";
import { adminLecturerSchema, adminStudentSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * =========================================================
 * 1. SERVER ACTION: createLecturerByAdminAction
 * Divalidasi dengan adminLecturerSchema dan diproteksi adminActionClient
 * =========================================================
 */
export const createLecturerByAdminAction = adminActionClient
  .inputSchema(adminLecturerSchema)
  .stateAction(async ({ parsedInput, ctx }) => {
    const response = await fetch(`${BACKEND_API_URL}/admin/lecturers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ctx.token}`,
      },
      body: JSON.stringify({
        nidn: parsedInput.nidn,
        name: parsedInput.name,
        email: parsedInput.email,
        password: parsedInput.password,
        titlePrefix: parsedInput.titlePrefix || "",
        titleSuffix: parsedInput.titleSuffix || "",
        phone: parsedInput.phone || "",
        officeRoom: parsedInput.officeRoom || "",
        consultHours: parsedInput.consultHours || "",
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Gagal menambahkan dosen ke database.");
    }

    revalidatePath("/admin/dosen");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Dosen baru berhasil ditambahkan!",
      lecturerId: data.lecturerId,
      newLecturer: {
        id: data.lecturerId,
        nidn: parsedInput.nidn,
        name: parsedInput.name,
        fullName: `${parsedInput.titlePrefix ? parsedInput.titlePrefix + " " : ""}${parsedInput.name}${parsedInput.titleSuffix ? ", " + parsedInput.titleSuffix : ""}`.trim(),
        email: parsedInput.email,
        phone: parsedInput.phone || "-",
        office_room: parsedInput.officeRoom || "-",
        total_classes: 0,
      },
    };
  });

/**
 * =========================================================
 * 2. SERVER ACTION: deleteLecturerByAdminAction
 * =========================================================
 */
export const deleteLecturerByAdminAction = adminActionClient
  .inputSchema(z.object({ id: z.number().int() }))
  .stateAction(async ({ parsedInput, ctx }) => {
    const response = await fetch(`${BACKEND_API_URL}/admin/lecturers/${parsedInput.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Gagal menghapus akun dosen.");
    }

    revalidatePath("/admin/dosen");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Akun dosen berhasil dihapus.",
      deletedId: parsedInput.id,
    };
  });

/**
 * =========================================================
 * 3. SERVER ACTION: createStudentByAdminAction
 * =========================================================
 */
export const createStudentByAdminAction = adminActionClient
  .inputSchema(adminStudentSchema)
  .stateAction(async ({ parsedInput, ctx }) => {
    const response = await fetch(`${BACKEND_API_URL}/admin/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ctx.token}`,
      },
      body: JSON.stringify({
        nim: parsedInput.nim,
        name: parsedInput.name,
        email: parsedInput.email,
        prodi: parsedInput.prodi,
        status: parsedInput.status,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Gagal menambahkan mahasiswa ke database.");
    }

    revalidatePath("/admin/mahasiswa");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Data mahasiswa berhasil ditambahkan!",
      studentId: data.studentId,
      newStudent: {
        id: data.studentId,
        nim: parsedInput.nim,
        name: parsedInput.name,
        email: parsedInput.email,
        prodi: parsedInput.prodi,
        status: parsedInput.status,
        enrolled_classes_count: 0,
      },
    };
  });

/**
 * =========================================================
 * 4. SERVER ACTION: deleteStudentByAdminAction
 * =========================================================
 */
export const deleteStudentByAdminAction = adminActionClient
  .inputSchema(z.object({ id: z.number().int() }))
  .stateAction(async ({ parsedInput, ctx }) => {
    const response = await fetch(`${BACKEND_API_URL}/admin/students/${parsedInput.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Gagal menghapus data mahasiswa.");
    }

    revalidatePath("/admin/mahasiswa");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Data mahasiswa berhasil dihapus.",
      deletedId: parsedInput.id,
    };
  });
