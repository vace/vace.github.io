"use client"

import { ArrowRight, ChevronLeft, Home, Search } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  const pathname = usePathname()

  return (
    <div className="container relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden py-20">
      {/* 404 Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="mb-2 text-9xl font-extrabold text-primary tracking-tighter">
            404
          </h1>
          <div className="h-2 w-24 bg-primary/30 rounded-full mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold mb-6">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Button variant="outline" asChild className="group">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild className="group">
            <Link href="/blog">
              Browse Blog
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="secondary" onClick={() => window.history.back()} className="group">
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </motion.div>

        {/* Display the path that was not found */}
        {pathname && (
          <motion.div
            className="mt-8 inline-flex items-center px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Search className="mr-2 h-3 w-3" />
            <code className="font-mono">{pathname}</code>
          </motion.div>
        )}
      </div>
    </div>
  )
}
