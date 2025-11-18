import { useMemo } from "react";

export const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const useYearOptions = () => {
  return useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, idx) => String(currentYear - idx));
  }, []);
};

export const useDayOptions = (birthdayParts) => {
  return useMemo(() => {
    if (!birthdayParts.year || !birthdayParts.month) return Array.from({ length: 31 }, (_, idx) => String(idx + 1).padStart(2, "0"));
    const daysInMonth = new Date(
      Number(birthdayParts.year),
      Number(birthdayParts.month),
      0
    ).getDate();
    return Array.from({ length: daysInMonth }, (_, idx) =>
      String(idx + 1).padStart(2, "0")
    );
  }, [birthdayParts]);
};

