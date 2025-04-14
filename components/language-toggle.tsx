"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        className="rounded-full text-xs px-3"
        onClick={() => setLanguage("en")}
      >
        {t("language.english")}
      </Button>
      <Button
        variant={language === "es" ? "default" : "outline"}
        size="sm"
        className="rounded-full text-xs px-3"
        onClick={() => setLanguage("es")}
      >
        {t("language.spanish")}
      </Button>
    </div>
  )
}
