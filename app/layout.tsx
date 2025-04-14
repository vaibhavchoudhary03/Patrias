import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ProgressProvider } from "@/contexts/progress-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { MainNav } from "@/components/main-nav"
import { Toaster } from "@/components/ui/toaster"

// Load Inter font
const inter = Inter({ subsets: ["latin"] })

// Define metadata for the application
export const metadata: Metadata = {
  title: "Patrias - US Citizenship Exam Prep",
  description: "Fun, interactive tools to help you prepare for your US citizenship exam",
    generator: 'v0.dev'
}

// Root layout component that wraps all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Theme provider for light/dark mode support */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Auth provider for user authentication */}
          <AuthProvider>
            {/* Language provider for multilingual support */}
            <LanguageProvider>
              {/* Progress provider to track and persist user progress */}
              <ProgressProvider>
                {/* Main navigation with hamburger menu */}
                <MainNav />
                {/* Main content */}
                <main>{children}</main>
                {/* Toast notifications */}
                <Toaster />
              </ProgressProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'