import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import { CSSProperties, Ref, RefCallback } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, format: string = 'MMM. D, YYYY') {
  return dayjs(date).format(format)
}

export function mergeRefs<T>(...refs: Ref<T>[]): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref) {
        ref.current = value
      }
    }
  }
}

export function randomInt(min: number, max?: number) {
  if (max === undefined) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getBackgroundElementList() {
  return Array.from({ length: 4 }, (_, i) => {
    const size = randomInt(50, 150)
    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: `hsl(${randomInt(360)}, 70%, 80%)`,
      left: `${randomInt(100)}%`,
      top: `${randomInt(100)}%`,
      transition: 'all 0.5s ease-in-out',
      // animation: `float ${randomInt(1000, 1500) / 100}s ease-in-out alternate infinite`,
      // animationDelay: `${randomInt(500) / 100}s`
    } as CSSProperties
  })
}
