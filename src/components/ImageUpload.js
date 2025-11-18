import React from "react";
import { buttonStyle } from "../styles/theme";

export const ImageUpload = ({ imagePreview, onImageChange, onSubmit, message, disabled }) => {
  const uploadLabelStyle = {
    display: "block",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "2px dashed rgba(255,255,255,0.2)",
    textAlign: "center",
    cursor: "pointer",
    color: "rgba(255,255,255,0.8)",
    fontSize: "14px",
    transition: "all 0.2s",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", marginBottom: "20px" }}>
        Upload a photo of your completed good deed:
      </p>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          style={uploadLabelStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {imagePreview ? "Change Image" : "Choose Image"}
        </label>
      </div>
      {imagePreview && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
        </div>
      )}
      <button
        onClick={onSubmit}
        disabled={disabled}
        style={{
          ...buttonStyle(disabled),
          width: "100%",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        Complete Good Deed
      </button>
      {message && (
        <div style={{ marginTop: "16px", fontSize: "16px", color: "#7af5c3" }}>
          {message}
        </div>
      )}
    </div>
  );
};

