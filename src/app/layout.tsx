import './global.css'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import clsx from 'clsx'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Body from '@/components/layout/body'
import { WebMetadata } from '@/common/config'
import { WaveBackground } from '@/components/ui/wave-background'
import { getBackgroundElementList } from '@/lib/utils'

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
