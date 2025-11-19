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
  const monthStr = String(month || "").trim().padStart(2, '0');
  const dayStr = String(day || "").trim().padStart(2, '0');
  
  // Check for empty strings explicitly
  if (!yearStr || !monthStr || !dayStr || 
      yearStr === "" || monthStr === "" || dayStr === "") {
    return "";
  }
  return `${yearStr}-${monthStr}-${dayStr}`;
};

/**
 * Parse a birthday ISO string (YYYY-MM-DD) into parts without timezone issues
 * @param {string} isoDate - Date string in YYYY-MM-DD format
 * @returns {Object} Object with year, month, day as strings
 */
export const parseBirthdayISO = (isoDate) => {
  if (!isoDate || typeof isoDate !== "string") {
    return { month: "", day: "", year: "" };
  }
  
  // Parse directly from string to avoid timezone issues
  const parts = isoDate.split("-");
  if (parts.length !== 3) {
    return { month: "", day: "", year: "" };
  }
  
  // Ensure month and day are padded to match select option format
  // Handle cases where day/month might not be padded (e.g., "2024-1-7" -> "2024-01-07")
  return {
    year: parts[0],
    month: parts[1].padStart(2, '0'),
    day: parts[2].padStart(2, '0'),
  };
};

/**
 * Format a birthday ISO string for display without timezone issues
 * @param {string} isoDate - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export const formatBirthdayDisplay = (isoDate) => {
  if (!isoDate || typeof isoDate !== "string") {
    return "Not set";
  }
  
  // Parse directly from string to avoid timezone issues
  const parts = isoDate.split("-");
  if (parts.length !== 3) {
    return "Not set";
  }
  
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  return `${monthNames[month - 1]} ${day}, ${year}`;
};

