"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, BookOpen, FileText, ListChecks, BarChart, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()
  const { t } = useLanguage()

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Check if a link is active
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-20 items-center justify-between px-6 md:px-8">
        {/* Logo and brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-blue-600">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">P</div>
          </div>
          <span className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Patrias
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/") ? "text-blue-600" : "text-muted-foreground"
            }`}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/study/flash-cards"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/study/flash-cards") ? "text-blue-600" : "text-muted-foreground"
            }`}
          >
            {t("nav.flashCards")}
          </Link>
          <Link
            href="/study/multiple-choice"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/study/multiple-choice") ? "text-blue-600" : "text-muted-foreground"
            }`}
          >
            {t("nav.multipleChoice")}
          </Link>
          <Link
            href="/study/fill-in-blank"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/study/fill-in-blank") ? "text-blue-600" : "text-muted-foreground"
            }`}
          >
            {t("nav.fillInBlank")}
          </Link>
          {isAuthenticated && (
            <Link
              href="/progress"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive("/progress") ? "text-blue-600" : "text-muted-foreground"
              }`}
            >
              {t("nav.progress")}
            </Link>
          )}
        </nav>

        {/* User menu or sign in button */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-blue-600 hover:bg-blue-50">
                <LogOut className="mr-2 h-4 w-4" />
                {t("nav.signOut")}
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="fun-button-primary">
              <Link href="/auth/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                {t("nav.signIn")}
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile hamburger menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-blue-600">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 py-6">
              {/* Mobile menu header with close button */}
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-blue-600">
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                      P
                    </div>
                  </div>
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                    Patrias
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-blue-600">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Language toggle in mobile menu */}
              <div className="px-2">
                <LanguageToggle />
              </div>

              {/* Mobile navigation links */}
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50"
                  onClick={handleLinkClick}
                >
                  <Home className="h-5 w-5 text-blue-600" />
                  <span>{t("nav.home")}</span>
                </Link>
                <Link
                  href="/study/flash-cards"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50"
                  onClick={handleLinkClick}
                >
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>{t("nav.flashCards")}</span>
                </Link>
                <Link
                  href="/study/multiple-choice"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50"
                  onClick={handleLinkClick}
                >
                  <ListChecks className="h-5 w-5 text-blue-600" />
                  <span>{t("nav.multipleChoice")}</span>
                </Link>
                <Link
                  href="/study/fill-in-blank"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50"
                  onClick={handleLinkClick}
                >
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>{t("nav.fillInBlank")}</span>
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/progress"
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50"
                    onClick={handleLinkClick}
                  >
                    <BarChart className="h-5 w-5 text-blue-600" />
                    <span>{t("nav.progress")}</span>
                  </Link>
                )}
              </nav>

              {/* Mobile user menu */}
              <div className="mt-auto">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("nav.signOut")}
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full fun-button-primary" onClick={handleLinkClick}>
                    <Link href="/auth/sign-in">
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("nav.signIn")}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
