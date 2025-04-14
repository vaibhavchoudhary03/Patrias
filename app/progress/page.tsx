"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, FileText, ListChecks, RotateCcw, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { questions, type Category } from "@/lib/questions"
import { useProgress } from "@/contexts/progress-context"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProgressPage() {
  // State for managing active tab
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  // Get auth and progress data
  const { isAuthenticated } = useAuth()
  const {
    studyModeProgress,
    getCompletionPercentage,
    getAccuracyPercentage,
    getCategoryCompletionPercentage,
    getCategoryAccuracyPercentage,
    resetProgress,
    isProgressAvailable,
  } = useProgress()

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router])

  // If not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-6 h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            You need to sign in to view your progress and track your study journey.
          </p>
          <div className="flex gap-4">
            <Button asChild className="rounded-full">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to get readable category names
  const getCategoryName = (category: Category): string => {
    switch (category) {
      case "AMERICAN_GOVERNMENT":
        return "American Government"
      case "AMERICAN_HISTORY":
        return "American History"
      case "INTEGRATED_CIVICS":
        return "Integrated Civics"
      default:
        return category
    }
  }

  // Helper function to count questions in each category
  const getQuestionCountByCategory = (category: Category): number => {
    return questions.filter((q) => q.category === category).length
  }

  return (
    <div className="container mx-auto px-6 md:px-8 py-12">
      {/* Header with navigation and reset button */}
      <div className="mb-8 flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Reset progress confirmation dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-accent rounded-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all your progress data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetProgress} className="rounded-full">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Page title */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Your Progress
        </h1>
        <p className="text-xl text-muted-foreground">Track your study progress across different modes and categories</p>
      </div>

      {/* Tabs for different progress views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-10 bg-blue-100 rounded-full p-1.5">
          <TabsTrigger value="overview" className="rounded-full">
            Overview
          </TabsTrigger>
          <TabsTrigger value="by-category" className="rounded-full">
            By Category
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="rounded-full">
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* Overview tab - progress by study mode */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Flash Cards progress card */}
            <StudyModeCard
              title="Flash Cards"
              icon={<BookOpen className="h-6 w-6" />}
              completed={getCompletionPercentage("flashCards")}
              correct={getAccuracyPercentage("flashCards")}
              total={100}
              href="/study/flash-cards"
              color="text-primary"
            />

            {/* Multiple Choice progress card (moved before Fill in the Blank) */}
            <StudyModeCard
              title="Multiple Choice"
              icon={<ListChecks className="h-6 w-6" />}
              completed={getCompletionPercentage("multipleChoice")}
              correct={getAccuracyPercentage("multipleChoice")}
              total={100}
              href="/study/multiple-choice"
              color="text-secondary"
            />

            {/* Fill in the Blank progress card */}
            <StudyModeCard
              title="Fill in the Blank"
              icon={<FileText className="h-6 w-6" />}
              completed={getCompletionPercentage("fillInBlank")}
              correct={getAccuracyPercentage("fillInBlank")}
              total={100}
              href="/study/fill-in-blank"
              color="text-accent"
            />
          </div>

          {/* Overall progress summary */}
          <Card className="mt-8 bubble-card fun-gradient">
            <CardHeader>
              <CardTitle className="text-2xl">Overall Progress</CardTitle>
              <CardDescription>Your combined progress across all study modes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Completion progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Questions Completed</span>
                    <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
                  </div>
                  <Progress value={getCompletionPercentage()} className="h-3 rounded-full" />
                </div>

                {/* Accuracy progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Accuracy Rate</span>
                    <span className="text-sm font-medium">{getAccuracyPercentage()}%</span>
                  </div>
                  <Progress value={getAccuracyPercentage()} className="h-3 rounded-full" />
                </div>

                {/* Estimated test readiness */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Estimated Test Readiness</span>
                    <span className="text-sm font-medium">
                      {Math.round((getCompletionPercentage() * getAccuracyPercentage()) / 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(getCompletionPercentage() * getAccuracyPercentage()) / 100}
                    className="h-3 rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Category tab - progress by content category */}
        <TabsContent value="by-category">
          <div className="grid gap-6 md:grid-cols-3">
            {(["AMERICAN_GOVERNMENT", "AMERICAN_HISTORY", "INTEGRATED_CIVICS"] as Category[]).map((category) => (
              <Card key={category} className="bubble-card">
                <CardHeader>
                  <CardTitle>{getCategoryName(category)}</CardTitle>
                  <CardDescription>{getQuestionCountByCategory(category)} questions in this category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Category completion progress */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm font-medium">{getCategoryCompletionPercentage(category)}%</span>
                      </div>
                      <Progress value={getCategoryCompletionPercentage(category)} className="h-3 rounded-full" />
                    </div>

                    {/* Category accuracy progress */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Accuracy</span>
                        <span className="text-sm font-medium">{getCategoryAccuracyPercentage(category)}%</span>
                      </div>
                      <Progress value={getCategoryAccuracyPercentage(category)} className="h-3 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations tab - personalized study suggestions */}
        <TabsContent value="recommendations">
          <Card className="bubble-card fun-gradient">
            <CardHeader>
              <CardTitle className="text-2xl">Study Recommendations</CardTitle>
              <CardDescription>Based on your performance, here are some areas to focus on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Recommendation for beginners */}
                {getCompletionPercentage() < 30 && (
                  <div className="rounded-2xl border p-4 bg-white/50">
                    <h3 className="mb-2 font-semibold">Start with Flash Cards</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      You're just getting started! Flash cards are a great way to familiarize yourself with all the
                      questions and answers.
                    </p>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/study/flash-cards">Study Flash Cards</Link>
                    </Button>
                  </div>
                )}

                {/* Recommendation based on category performance */}
                {getCategoryCompletionPercentage("AMERICAN_HISTORY") <
                  getCategoryCompletionPercentage("AMERICAN_GOVERNMENT") && (
                  <div className="rounded-2xl border p-4 bg-white/50">
                    <h3 className="mb-2 font-semibold">Focus on American History</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Your progress in the American History section is lower than other areas. We recommend spending
                      more time on these questions.
                    </p>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/study/flash-cards">Study American History</Link>
                    </Button>
                  </div>
                )}

                {/* Recommendation based on study mode performance */}
                {getAccuracyPercentage("fillInBlank") < getAccuracyPercentage("multipleChoice") && (
                  <div className="rounded-2xl border p-4 bg-white/50">
                    <h3 className="mb-2 font-semibold">Practice Fill in the Blank</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Your performance in Fill in the Blank exercises is lower than Multiple Choice. This mode helps
                      with recall which is important for the oral exam.
                    </p>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/study/fill-in-blank">Practice Fill in the Blank</Link>
                    </Button>
                  </div>
                )}

                {/* General recommendation for elderly applicants */}
                <div className="rounded-2xl border p-4 bg-white/50">
                  <h3 className="mb-2 font-semibold">Review 65+ Years Questions</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    If you're 65 or older and have been a permanent resident for 20+ years, focus on the questions
                    marked with an asterisk (*).
                  </p>
                  <Button asChild size="sm" className="rounded-full">
                    <Link href="/study/flash-cards">Study 65+ Questions</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component for displaying study mode progress cards
interface StudyModeCardProps {
  title: string
  icon: React.ReactNode
  completed: number
  correct: number
  total: number
  href: string
  color: string
}

function StudyModeCard({ title, icon, completed, correct, total, href, color }: StudyModeCardProps) {
  return (
    <Card className="bubble-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className={color}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Completion progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Completion</span>
              <span className="text-sm font-medium">{completed}%</span>
            </div>
            <Progress value={completed} className="h-3 rounded-full" />
          </div>

          {/* Accuracy progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Accuracy</span>
              <span className="text-sm font-medium">{correct}%</span>
            </div>
            <Progress value={correct} className="h-3 rounded-full" />
          </div>

          {/* Continue studying button */}
          <div className="pt-2">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href={href}>Continue Studying</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
