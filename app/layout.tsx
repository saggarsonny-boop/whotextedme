import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WhoTextedMe — Free Phone Lookup',
  description: 'Free reverse phone number lookup. Find carrier, line type, and location for any number.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
