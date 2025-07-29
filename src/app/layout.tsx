import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Промяна 1
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'

// Промяна 2
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Freelance System',
  description: 'A web application for freelancers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Промяна 3
    <html lang="en" className={inter.className}>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}