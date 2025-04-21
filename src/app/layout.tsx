import './global.css'

import clsx from 'clsx'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { ViewTransitions } from 'next-view-transitions'

import { WebMetadata } from '@/common/config'
import Body from '@/components/layout/body'
import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { WaveBackground } from '@/components/ui/wave-background'
import { getBackgroundElementList } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import type { Metadata } from 'next'
export const metadata: Metadata = WebMetadata

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const backgroundList = getBackgroundElementList()

  return (
    <ViewTransitions>
      <html
        suppressHydrationWarning
        className={clsx('antialiased', GeistSans.variable, GeistMono.variable)}
      >
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className="min-h-screen flex flex-col relative">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <WaveBackground
              elements={backgroundList}
            />
            <Navbar />
            <Body>
              {children}
            </Body>
            <Footer />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  )
}
