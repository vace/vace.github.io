"use client";

import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

interface PointerTrackingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the glow effect (default: 100px)
   */
  glowSize?: number;
  /**
   * Transition duration in ms (default: 500)
   */
  transitionDuration?: number;
  /**
   * Whether the effect should be visible when the mouse is not over the element (default: false)
   */
  alwaysVisible?: boolean;
}

export const PointerTracking: React.FC<PointerTrackingProps> = ({
  glowSize = 60,
  transitionDuration = 500,
  alwaysVisible = false,
}) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isMouseInView, setIsMouseInView] = useState(false);
  const { theme } = useTheme()

  // rgb(255 240 133)
  const glowColor = theme !== "dark" ? "rgba(255, 250, 133, 0.3)" : 'rgba(255, 250, 133, 0.1)';

  useEffect(() => {
    let lastClientX = 0;
    let lastClientY = 0;

    const updateMousePosition = () => {
      // const x = lastClientX + window.scrollX
      // const y = lastClientY + window.scrollY
      setMousePosition({ x: lastClientX, y: lastClientY })
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      updateMousePosition()
      setIsMouseInView(true)
    }
    
    const handleMouseLeave = () => {
      setIsMouseInView(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", updateMousePosition);
    
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", updateMousePosition);
    };
  }, [isMouseInView]);

  // Generate the background style
  const backgroundStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 10,
    opacity: (mousePosition && isMouseInView) || alwaysVisible ? 1 : 0,
    transition: `opacity ${transitionDuration}ms ease-out`,
    background: mousePosition && isMouseInView
      ? `radial-gradient(circle ${glowSize}px at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 70%)`
      : "transparent",
  };

  return (
    <motion.div
      style={backgroundStyle}
      initial={{ opacity: 0 }}
      animate={{
        opacity: (mousePosition && isMouseInView) || alwaysVisible ? 1 : 0
      }}
      transition={{ duration: transitionDuration / 1000 }}
    />
  );
};
