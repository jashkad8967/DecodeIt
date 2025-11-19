import React, { useState, useEffect } from "react";
import { gradientFrameStyle, cardWrapperStyle, mainCardStyle } from "../styles/theme";
import { getCardStyle } from "../utils/themeHelpers";

export const CardFrame = ({ children, theme = "dark" }) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardStyle = getCardStyle(theme, isMobile);
  return (
    <div style={cardWrapperStyle(isMobile)}>
      <div style={gradientFrameStyle(isMobile)}>
        <div style={cardStyle}>{children}</div>
      </div>
    </div>
  );
};

