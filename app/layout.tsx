import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'FairMoney Pay',
  description: 'Grow your business with FairMoney - Loans, Airtime, Data, Bills & More',
  generator: 'FairMoney',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#1a9b5c]">
      <body className={`font-sans antialiased bg-[#1a9b5c]`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
