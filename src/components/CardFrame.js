import React from "react";
import { gradientFrameStyle, cardWrapperStyle, mainCardStyle } from "../styles/theme";
import { getCardStyle } from "../utils/themeHelpers";

export const CardFrame = ({ children, theme = "dark" }) => {
  const cardStyle = getCardStyle(theme);
  return (
    <div style={cardWrapperStyle}>
      <div style={gradientFrameStyle}>
        <div style={cardStyle}>{children}</div>
      </div>
    </div>
  );
};

