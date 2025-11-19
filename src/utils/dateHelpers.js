export const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export const isSameDay = (date1, date2) => date1 === date2;

export const buildBirthdayISO = (parts) => {
  if (!parts) return "";
  const { year, month, day } = parts;
  
  // Convert to strings and trim
  const yearStr = String(year || "").trim();
  const monthStr = String(month || "").trim();
  const dayStr = String(day || "").trim();
  
  // Check for empty strings explicitly
  if (!yearStr || !monthStr || !dayStr || 
      yearStr === "" || monthStr === "" || dayStr === "") {
    return "";
  }
  return `${yearStr}-${monthStr}-${dayStr}`;
};

