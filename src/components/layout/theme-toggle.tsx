'use client'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { type HTMLAttributes, useLayoutEffect, useState } from 'react'
import Sun from '../icons/Sun'
import MoonIcon from '../icons/Moon'
import SunMoon from '../icons/SunMoon'

const full = [
  ['light', Sun] as const,
  ['dark', MoonIcon] as const,
  ['system', SunMoon] as const,
]

export function ThemeToggle({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const value = mounted ? theme : null

  return (
    <div className={cn('inline-flex items-center rounded-full border p-1', className)} data-theme-toggle="" {...props}>
      {full.map(([key, Icon]) => (
        <Icon
          key={key}
          aria-label={key}
          className={cn('size-6.5 rounded-full p-1.5 text-muted-foreground', value === key ? 'bg-accent text-accent-foreground' : 'text-muted-foreground')}
          onClick={() => setTheme(key)}
        />
      ))}
    </div>
  )
}
