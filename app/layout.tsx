import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Options Dashboard - Stock & Options Screener',
  description: 'Screen stocks and options with advanced filtering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full">{children}</body>
    </html>
  )
}

