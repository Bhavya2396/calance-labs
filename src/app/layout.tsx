import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Calance Labs | Enterprise AI That Transforms',
  description: 'We build intelligent systems that create lasting competitive advantage. Custom AI solutions for forward-thinking enterprises.',
  keywords: ['AI', 'Enterprise AI', 'Machine Learning', 'Artificial Intelligence', 'AI Consulting'],
  openGraph: {
    title: 'Calance Labs | Enterprise AI That Transforms',
    description: 'We build intelligent systems that create lasting competitive advantage.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
