import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { getProfile } from '@/lib/getProfile'
import { SkipLink } from '@/components/SkipLink'
import { ScrollToTop } from '@/components/ScrollToTop'

const { profile } = getProfile()

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: true,
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
  ),
  title: `${profile.name} | ${profile.title}`,
  description: profile.summary.join(' '),
  openGraph: {
    title: `${profile.name} | ${profile.title}`,
    description: profile.summary.join(' '),
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: profile.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} | ${profile.title}`,
    description: profile.summary.join(' '),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <SkipLink />
        {children}
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
