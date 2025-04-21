"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, RssIcon } from "lucide-react"

import { navItems } from "@/common/nav"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WebsiteProfile } from "@/common/config"
import { ThemeToggle } from "./theme-toggle"
import Github from "../icons/Github"
import VaceIcon from "../icons/Vace"

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/30 backdrop-blur-sm">
      <div className="container flex h-16 items-center mx-auto space-x-6 px-4 md:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <VaceIcon width={80} height={32} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <MobileSheetMenu
          pathname={pathname}
        />

        {/* Common Menu */}
        <DesktopMenu
          pathname={pathname}
        />
        
        {/* Common Menu */}
        <div className="flex items-center gap-1 ml-auto">          
          <Button variant="ghost" size="icon" asChild>
            <Link href={WebsiteProfile.Github} className="flex items-center">
              <Github className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link
              href="/rss"
              className="flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon className="h-4 w-4" />
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Navbar


type IMenuProps = {
  pathname: string
}
function MobileSheetMenu({ pathname }: IMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="w-full max-w-xs">
        <nav className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className={cn(
                  "text-muted-foreground flex items-center text-lg transition-colors hover:text-primary",
                  isUrlActive(item.url, pathname) && "text-primary font-medium"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DesktopMenu ({ pathname }: IMenuProps) {
  return (
    <div className="hidden gap-8 items-center md:flex ml-8">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.url}
          className={cn(
            "text-muted-foreground font-semibold transition-colors hover:text-primary",
            isUrlActive(item.url, pathname) && "text-primary font-bold"
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

function isUrlActive (url: string, pathname: string) {
  if (url === "/") {
    return pathname === url
  }
  return url === pathname || pathname.startsWith(url)
}