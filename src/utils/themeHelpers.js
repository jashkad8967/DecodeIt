/**
 * Theme helper functions
 */

/**
 * Get theme-aware text color
 * @param {string} theme - Current theme ("dark" or "light")
 * @param {string} variant - "primary" or "secondary"
 * @returns {string} Color value
 */
export const getTextColor = (theme, variant = "primary") => {
  if (theme === "light") {
    return variant === "primary" ? "#1a202c" : "#4a5568";
  }
  return variant === "primary" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)";
};

/**
 * Get theme-aware background color for cards
 * @param {string} theme - Current theme ("dark" or "light")
 * @returns {string} Color value
 */
export const getCardBg = (theme) => {
  return theme === "light" ? "#f7fafc" : "rgba(0,0,0,0.25)";
};

/**
 * Get theme-aware border color
 * @param {string} theme - Current theme ("dark" or "light")
 * @returns {string} Color value
 */
export const getCardBorder = (theme) => {
  return theme === "light" ? "#e2e8f0" : "rgba(255,255,255,0.08)";
};

/**
 * Get theme-aware input style
 * @param {string} theme - Current theme ("dark" or "light")
 * @returns {Object} Style object
 */
export const getInputStyle = (theme) => {
  return {
    width: "100%",
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "12px",
    border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.15)",
    background: theme === "light" ? "#ffffff" : "rgba(255,255,255,0.08)",
    color: theme === "light" ? "#1a202c" : "#f7f8fb",
    marginTop: "16px",
    outline: "none",
    transition: "all 0.2s ease",
  };
};

/**
 * Get theme-aware card style
 * @param {string} theme - Current theme ("dark" or "light")
 * @returns {Object} Style object
 */
export const getCardStyle = (theme, isMobile = false) => {
  return {
    width: "100%",
    maxWidth: isMobile ? "100%" : 640,
    margin: "0 auto",
    background: theme === "light" 
      ? "linear-gradient(135deg, #ffffff 0%, #f7fafc 50%, #edf2f7 100%)" 
      : "#272a33",
    border: theme === "light" 
      ? "1px solid #e2e8f0" 
      : "1px solid rgba(255,255,255,0.08)",
    borderRadius: isMobile ? "20px" : "32px",
    padding: isMobile ? "24px 20px 32px" : "48px 48px 56px",
    boxShadow: theme === "light" 
      ? "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)" 
      : "0 30px 80px rgba(0,0,0,0.55)",
    textAlign: "center",
    backdropFilter: "blur(18px)",
    position: "relative",
    zIndex: 2,
    boxSizing: "border-box",
  };
};

