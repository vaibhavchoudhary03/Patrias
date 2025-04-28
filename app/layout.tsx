import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { MainNav } from "@/components/main-nav"

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
        <Providers>
          <MainNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}


import './globals.css'