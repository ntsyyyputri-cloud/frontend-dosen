"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useCetakPDF() {
  const [lecturer, setLecturer] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGrades = (classId: number) => {
    setIsLoading(true);
    apiFetch(`/grades/${classId}`)
      .then((res) => {
        setGrades(res.grades || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("gradia_lecturer") : null;
    if (stored) {
      try {
        setLecturer(JSON.parse(stored));
      } catch (e) {}
    }

    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          setSelectedClassId(res.classes[0].id);
          fetchGrades(res.classes[0].id);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleClassChange = (classId: number) => {
    setSelectedClassId(classId);
    fetchGrades(classId);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const lecturerDisplayName = lecturer
    ? `${lecturer.title_prefix ? lecturer.title_prefix + " " : ""}${lecturer.name}${lecturer.title_suffix ? ", " + lecturer.title_suffix : ""}`
    : "Dosen Pengampu";

  return {
    lecturer,
    classes,
    selectedClassId,
    grades,
    isLoading,
    handleClassChange,
    handlePrint,
    currentClass,
    lecturerDisplayName,
  };
}

