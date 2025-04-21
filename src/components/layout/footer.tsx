"use client"

import Link from 'next/link'
import * as React from 'react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-sm relative h-48">

      <svg className="absolute bottom-0 w-full h-48 fill-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <path
          d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,400 L0,400 Z"
          className="transform-gpu transition-all duration-700 fill-primary/5 dark:fill-primary/5"
        />
        <path
          d="M0,100 C150,300 350,50 500,200 C650,300 850,50 1000,200 L1000,400 L0,400 Z"
          className="transform-gpu transition-all duration-1000 fill-primary/5 dark:fill-primary/10"
        />
      </svg>

      <div className="container flex mt-28 h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Vace © {year} <span className="mx-1"> | </span> Powered by{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 hover:underline text-primary"
            >
              Next.js
            </Link>
          </div>
          <div className="text-sm italic text-muted-foreground border-l-2 border-muted-foreground pl-4">
            Code with AI, Future is nigh.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer