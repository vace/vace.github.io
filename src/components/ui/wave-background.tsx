"use client"

import { CSSProperties, useEffect, useRef, useState } from "react";
import { PointerTracking } from "./pointer-tracking";
import { usePathname } from "next/navigation";
import { getBackgroundElementList } from "@/lib/utils";

// 波浪背景效果
export const WaveBackground = ({ elements }: { elements: CSSProperties[] }) => {

  const [elementList, setElementList] = useState<CSSProperties[]>(elements)
  const prevPathRef = useRef<string>("")
  const pathname = usePathname()

  useEffect(() => {
    if (!prevPathRef.current) {
      prevPathRef.current = pathname
      return
    }
    setElementList(getBackgroundElementList())
  }, [pathname])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {elementList.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
            style={_}
          />
        ))}
      </div>
      <PointerTracking />
    </>
  );
};
