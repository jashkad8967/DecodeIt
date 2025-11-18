import React from "react";
import { dateGridStyle } from "../styles/theme";

export const BirthdayInput = ({ birthdayParts, updateBirthdayParts, monthOptions, dayOptions, yearOptions, theme = "dark" }) => {
  const selectStyle = {
    width: "100%",
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "12px",
    marginTop: "6px",
    background: theme === "light" ? "#ffffff" : "#1a1c24",
    color: theme === "light" ? "#1a202c" : "#f7f8fb",
    border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    outline: "none",
  };
  
  const labelStyle = {
    fontSize: "12px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: theme === "light" ? "#4a5568" : "rgba(255,255,255,0.65)",
  };
  
  return (
    <div style={dateGridStyle}>
      <div>
        <label style={labelStyle}>Month</label>
        <select
          value={birthdayParts.month}
          onChange={(e) => updateBirthdayParts("month", e.target.value)}
          style={selectStyle}
        >
          <option value="">Select month</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Day</label>
        <select
          value={birthdayParts.day}
          onChange={(e) => updateBirthdayParts("day", e.target.value)}
          style={selectStyle}
        >
          <option value="">Select day</option>
          {dayOptions.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Year</label>
        <select
          value={birthdayParts.year}
          onChange={(e) => updateBirthdayParts("year", e.target.value)}
          style={selectStyle}
        >
          <option value="">Select year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

