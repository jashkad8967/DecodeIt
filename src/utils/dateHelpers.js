export const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export const isSameDay = (date1, date2) => date1 === date2;

export const buildBirthdayISO = (parts) => {
  const { year, month, day } = parts;
  if (!year || !month || !day) return "";
  return `${year}-${month}-${day}`;
};

