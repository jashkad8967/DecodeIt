import { useState, useEffect } from "react";

export const useAdOffsets = () => {
  const [adOffsets, setAdOffsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const selectors = [
      ".ad-banner",
      ".adsbygoogle",
      "[data-ad-slot]",
      ".ad-container",
      "#top-ads",
      "#bottom-ads",
    ];

    const computeOffsets = () => {
      const banners = Array.from(
        document.querySelectorAll(selectors.join(","))
      );

      let top = 0;
      let bottom = 0;
      let left = 0;
      let right = 0;

      banners.forEach((banner) => {
        if (!banner.offsetHeight || !banner.getBoundingClientRect) return;
        const rect = banner.getBoundingClientRect();
        const isFixed =
          getComputedStyle(banner).position === "fixed" ||
          banner.dataset?.adPosition === "fixed";

        if (!isFixed) return;

        if (rect.top <= 5) {
          top = Math.max(top, rect.height);
        } else if (window.innerHeight - rect.bottom <= 5) {
          bottom = Math.max(bottom, rect.height);
        }

        const marginBuffer = 40;
        if (rect.left <= window.innerWidth / 2) {
          left = Math.max(left, rect.width + marginBuffer);
        }
        if (rect.right >= window.innerWidth / 2) {
          right = Math.max(right, rect.width + marginBuffer);
        }
      });

      setAdOffsets((prev) => {
        if (
          prev.top === top &&
          prev.bottom === bottom &&
          prev.left === left &&
          prev.right === right
        )
          return prev;
        return { top, bottom, left, right };
      });
    };

    const observer = new MutationObserver(() => {
      requestAnimationFrame(computeOffsets);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", computeOffsets);
    computeOffsets();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeOffsets);
    };
  }, []);

  return adOffsets;
};

