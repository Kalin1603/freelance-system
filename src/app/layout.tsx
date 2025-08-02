import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Промяна 1
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { Toaster } from 'react-hot-toast'

// Промяна 2
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Freelance System',
  description: 'A web application for freelancers',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <LanguageProvider>
          {/* НОВО: Поставяме Toaster тук, за да е достъпен навсякъде */}
          <Toaster position="bottom-center" toastOptions={{
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }} />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}