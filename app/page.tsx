"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ListChecks, FileText, BarChart, Award } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-6 md:px-8 py-16">
      {/* Hero section with gradient elements */}
      <div className="mb-16 text-center relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50"></div>

        <h1 className="mb-6 text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          {t("home.title")}
        </h1>
        <p className="mx-auto max-w-2xl text-2xl text-muted-foreground">{t("home.subtitle")}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="button-3d bg-blue-500 hover:bg-blue-600 text-lg">
            <Link href="/study/flash-cards">{t("home.startStudying")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="button-wavy text-blue-600 border-blue-300 text-lg">
            <Link href="/auth/sign-up">{t("home.createAccount")}</Link>
          </Button>
        </div>
      </div>

      {/* Study mode cards grid with floating animation */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Flash Cards study mode */}
        <StudyModeCard
          title={t("nav.flashCards")}
          description={t("flashCards.title")}
          icon={<BookOpen className="h-10 w-10" />}
          href="/study/flash-cards"
          color="bg-blue-100"
          iconColor="text-blue-600"
          delay="0s"
        />

        {/* Multiple Choice study mode (moved before Fill in the Blank) */}
        <StudyModeCard
          title={t("nav.multipleChoice")}
          description={t("multipleChoice.title")}
          icon={<ListChecks className="h-10 w-10" />}
          href="/study/multiple-choice"
          color="bg-blue-50"
          iconColor="text-blue-500"
          delay="0.2s"
        />

        {/* Fill in the Blank study mode */}
        <StudyModeCard
          title={t("nav.fillInBlank")}
          description={t("fillInBlank.title")}
          icon={<FileText className="h-10 w-10" />}
          href="/study/fill-in-blank"
          color="bg-accent/10"
          iconColor="text-accent"
          delay="0.4s"
        />
      </div>

      {/* Progress tracking section */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          {t("home.trackProgress")}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">{t("home.progressDescription")}</p>

        <Card className="mx-auto max-w-4xl bubble-card fun-gradient-blue">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Award className="h-8 w-8" />}
                title={t("progress.title")}
                description={t("progress.subtitle")}
              />
              <FeatureCard
                icon={<BarChart className="h-8 w-8" />}
                title={t("progress.overview")}
                description={t("progress.byCategory")}
              />
              <FeatureCard
                icon={<BookOpen className="h-8 w-8" />}
                title={t("progress.recommendations")}
                description={t("progress.continueStudying")}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <Button asChild className="button-glow bg-blue-500 hover:bg-blue-600">
              <Link href="/auth/sign-up">{t("home.createAccount")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Study tips section */}
      <div className="mt-24">
        <Card className="bubble-card fun-gradient-blue">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-700">{t("home.studyTips")}</CardTitle>
            <CardDescription className="text-center">{t("home.studyTipsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-4 md:grid-cols-2">
              <li className="flex items-start gap-3 p-4 rounded-2xl bg-white/80">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Focus on exact answers</h3>
                  <p className="text-sm text-muted-foreground">
                    Memorize the answers as they appear in USCIS materials
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-2xl bg-white/80">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Study daily</h3>
                  <p className="text-sm text-muted-foreground">Short, regular sessions are better than cramming</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-2xl bg-white/80">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Practice speaking</h3>
                  <p className="text-sm text-muted-foreground">The test is oral, so practice saying answers out loud</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-2xl bg-white/80">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium">65+ Years Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    If you're 65+ with 20+ years as a permanent resident, focus on asterisk (*) questions
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild className="fun-button-primary">
              <Link href="/study/flash-cards">{t("home.startStudying")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

// Component for each study mode card on the home page
interface StudyModeCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  iconColor: string
  delay: string
}

function StudyModeCard({ title, description, icon, href, color, iconColor, delay }: StudyModeCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="h-full bubble-card float" style={{ animationDelay: delay }}>
        <CardHeader>
          {/* Icon container with background color */}
          <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${color}`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <CardTitle className="text-2xl text-blue-700">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" className="w-full rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Component for feature cards in the progress section
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/80">
      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <div className="text-blue-600">{icon}</div>
      </div>
      <h3 className="text-lg font-medium mb-2 text-blue-700">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
