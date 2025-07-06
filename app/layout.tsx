import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import DynamicCalendlyWidget from "@/components/dynamic-calendly-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shoaib Tashrif - AI Engineer Portfolio",
  description: "AI Engineer specializing in conversational AI, chatbots, and voice processing systems",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <DynamicCalendlyWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
