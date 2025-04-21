"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import { cn } from "@/lib/utils";

interface PinContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  titleComponent?: React.ReactNode;
  href?: string;
  className?: string;
}

export const PinContainer = ({
  children,
  title,
  titleComponent,
  href,
  className,
  ...props
}: PinContainerProps) => {
  // 平滑的弹簧效果
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  useEffect(() => {
    // document move
    const handleMouseMove = (e: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;

      const relativeX = (mouseX - centerX) / centerX;
      const relativeY = (mouseY - centerY) / centerY;

      const rx = -relativeY * 10;
      const ry = relativeX * 10;

      rotateX.set(rx);
      rotateY.set(ry);
    };
    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [])

  return (
    <div
      className={cn(
        "relative group perspective-[1000] hover:cursor-pointer hover:scale-[1.05] transition-transform duration-300",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "preserve-3d relative w-full h-full",
        )}
        style={{
          rotateX,
          rotateY,
        }}
      >
        {/* 内容容器 */}
        <div className="preserve-3d inset-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
};