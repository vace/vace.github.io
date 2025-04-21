"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BodyProps {
  children: React.ReactNode
  className?: string
}

export function Body({ children, className }: BodyProps) {
  return (
    <main className={cn("container mx-auto flex-1 p-4 md:p-6 lg:p-8", className)}>
      {children}
    </main>
  )
}

export default Body