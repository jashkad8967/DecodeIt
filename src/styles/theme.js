import { FRAME_WIDTH } from "../constants/config";

export const mainCardStyle = {
  width: "100%",
  maxWidth: 640,
  margin: "0 auto",
  background: "#272a33",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "32px",
  padding: "48px 48px 56px",
  boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  textAlign: "center",
  backdropFilter: "blur(18px)",
  position: "relative",
  zIndex: 2,
};

export const buttonStyle = (disabled = false) => ({
  padding: "12px 28px",
  marginTop: "24px",
  fontSize: "16px",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
  border: "none",
  borderRadius: "999px",
  background:
    "linear-gradient(135deg, rgba(107,123,255,0.9), rgba(181,75,255,0.9))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(107,123,255,0.4)",
  transition: "transform 0.2s ease",
});

export const inputStyle = {
  width: "100%",
  padding: "14px 18px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#f7f8fb",
  marginTop: "16px",
  outline: "none",
};

export const selectStyle = (theme = "dark") => ({
  ...inputStyle,
  marginTop: "6px",
  background: theme === "light" ? "#ffffff" : "#1a1c24",
  color: theme === "light" ? "#1a202c" : "#f7f8fb",
  border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.15)",
  cursor: "pointer",
});

export const selectLabelStyle = {
  fontSize: "12px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.65)",
};

export const chipStyle = (theme = "dark") => ({
  padding: "6px 14px",
  borderRadius: "999px",
  background: theme === "light" ? "#edf2f7" : "rgba(255,255,255,0.08)",
  color: theme === "light" ? "#4a5568" : "rgba(255,255,255,0.8)",
  fontSize: "12px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
});

export const dateGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "14px",
  width: "100%",
  marginTop: "12px",
};

export const gradientFrameStyle = {
  width: "100%",
  maxWidth: 760,
  margin: "0 auto",
  padding: "1.5px",
  borderRadius: "36px",
  background: "linear-gradient(135deg, rgba(101,130,255,0.6), rgba(255,106,179,0.4))",
  boxShadow: "0 35px 90px rgba(0,0,0,0.55)",
};

export const cardWrapperStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "0 12px",
  boxSizing: "border-box",
};

export const topBarStyle = (adOffsets, theme = "dark") => ({
  position: "sticky",
  top: Math.max(adOffsets.top + 16, 16),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 26px",
  borderRadius: "24px",
  background: theme === "light" 
    ? "linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)" 
    : "rgba(4, 6, 18, 0.8)",
  border: theme === "light" 
    ? "1px solid #e2e8f0" 
    : "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  zIndex: 5,
  boxShadow: theme === "light" 
    ? "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)" 
    : "0 20px 60px rgba(0,0,0,0.45)",
  width: "100%",
  maxWidth: 760,
  alignSelf: "center",
});

export const navButtonStyle = (active, theme = "dark") => ({
  padding: "10px 20px",
  borderRadius: "999px",
  border: "none",
  fontSize: "15px",
  fontWeight: 600,
  color: active 
    ? (theme === "light" ? "#1a202c" : "#080a1e")
    : (theme === "light" ? "#4a5568" : "#f0f4ff"),
  background: active
    ? (theme === "light" 
        ? "linear-gradient(135deg, #edf2f7, #e2e8f0)" 
        : "linear-gradient(135deg, #f8fbff, #cdd7ff)")
    : "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
});

export const footerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
  padding: "32px",
  borderRadius: "28px",
  background: "#272a33",
  border: "1px solid rgba(255,255,255,0.05)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  width: "100%",
  maxWidth: 760,
  margin: "0 auto",
  alignSelf: "center",
  boxSizing: "border-box",
};

// API endpoint configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

