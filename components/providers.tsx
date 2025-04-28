"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { ProgressProvider } from "@/contexts/progress-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <LanguageProvider>
          <ProgressProvider>
            {children}
            <Toaster />
          </ProgressProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 