"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages
export type Language = "en" | "es"

// Define language context type
interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // State for current language
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})

  // Load translations on mount
  useEffect(() => {
    const loadTranslations = async () => {
      const enTranslations = await import("@/translations/en").then((module) => module.default)
      const esTranslations = await import("@/translations/es").then((module) => module.default)

      setTranslations({
        en: enTranslations,
        es: esTranslations,
      })
    }

    loadTranslations()
  }, [])

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("patrias_language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("patrias_language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (!translations[language]) return key
    return translations[language][key] || translations["en"][key] || key
  }

  // Provide language context to children
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
