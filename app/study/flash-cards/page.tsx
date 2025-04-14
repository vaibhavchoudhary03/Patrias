"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Filter, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { questions } from "@/lib/questions"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useProgress } from "@/contexts/progress-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function FlashCardsPage() {
  // State for managing the flash cards
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [filteredQuestions, setFilteredQuestions] = useState(questions)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Get progress tracking functions from context
  const { recordAttempt, isProgressAvailable } = useProgress()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Get the current question based on the index
  const currentQuestion = filteredQuestions[currentIndex]

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  // Flip card to show answer/question
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // Filter questions based on user selections
  const filterQuestions = (filters: {
    americanGovernment: boolean
    americanHistory: boolean
    integratedCivics: boolean
    elderlyOnly: boolean
  }) => {
    let filtered = [...questions]

    // Filter by category
    const categories = []
    if (filters.americanGovernment) categories.push("AMERICAN_GOVERNMENT")
    if (filters.americanHistory) categories.push("AMERICAN_HISTORY")
    if (filters.integratedCivics) categories.push("INTEGRATED_CIVICS")

    if (categories.length > 0) {
      filtered = filtered.filter((q) => categories.includes(q.category))
    }

    // Filter for elderly-only questions if selected
    if (filters.elderlyOnly) {
      filtered = filtered.filter((q) => q.isForElderlyOnly)
    }

    // Update state with filtered questions and reset position
    setFilteredQuestions(filtered)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  // Progress tracking handlers
  const handleMarkAsKnown = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      toast({
        title: "Sign in required",
        description: "Create an account or sign in to track your progress",
        variant: "default",
      })
      return
    }

    recordAttempt(currentQuestion.id, "flashCards", true, currentQuestion.category)
    handleNext()
  }

  const handleMarkAsUnknown = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      toast({
        title: "Sign in required",
        description: "Create an account or sign in to track your progress",
        variant: "default",
      })
      return
    }

    recordAttempt(currentQuestion.id, "flashCards", false, currentQuestion.category)
    handleNext()
  }

  return (
    <div className="container mx-auto px-6 md:px-8 py-12">
      {/* Header with navigation and filter */}
      <div className="mb-8 flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Filter sheet for selecting question categories */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="mr-2 h-4 w-4" />
              Filter Questions
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Questions</SheetTitle>
              <SheetDescription>Select categories to study specific topics</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <FilterOption id="american-government" label="American Government" />
              <FilterOption id="american-history" label="American History" />
              <FilterOption id="integrated-civics" label="Integrated Civics" />
              <FilterOption id="elderly-only" label="65+ Years Old Questions Only" />

              <Button
                className="w-full mt-4 rounded-full fun-button-primary"
                onClick={() =>
                  filterQuestions({
                    americanGovernment: (document.getElementById("american-government") as HTMLInputElement).checked,
                    americanHistory: (document.getElementById("american-history") as HTMLInputElement).checked,
                    integratedCivics: (document.getElementById("integrated-civics") as HTMLInputElement).checked,
                    elderlyOnly: (document.getElementById("elderly-only") as HTMLInputElement).checked,
                  })
                }
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Page title and progress indicator */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Flash Cards
        </h1>
        <div className="text-base text-muted-foreground">
          Card {currentIndex + 1} of {filteredQuestions.length}
        </div>
      </div>

      {/* Flash card container with 3D flip effect */}
      <div className="flex justify-center">
        <div
          className="relative h-[400px] w-full max-w-3xl mx-auto cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div className={`absolute h-full w-full duration-500 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
            {/* Front of card (question) */}
            <Card className="absolute h-full w-full backface-hidden p-6 flex flex-col justify-between bubble-card fun-gradient-blue">
              <div>
                <div className="mb-4 flex justify-between">
                  <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600">
                    Question {currentQuestion.id}
                  </Badge>
                  {currentQuestion.isForElderlyOnly && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full">65+ Years*</Badge>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-blue-800">{currentQuestion.question}</h2>
              </div>
              <div className="text-center text-sm text-muted-foreground">Tap to reveal answer</div>
            </Card>

            {/* Back of card (answer) */}
            <Card className="absolute h-full w-full backface-hidden p-6 rotate-y-180 flex flex-col justify-between bubble-card fun-gradient-blue">
              <div>
                <div className="mb-4 flex justify-between">
                  <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600">
                    Answer
                  </Badge>
                  {currentQuestion.isForElderlyOnly && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full">65+ Years*</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {currentQuestion.answers.map((answer, index) => (
                    <div key={index} className="rounded-2xl bg-white/80 p-3">
                      • {answer}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">Tap to see question</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation and progress tracking buttons */}
      <div className="mt-12 flex flex-wrap justify-center gap-5">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0} className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button variant="outline" onClick={handleReset} className="rounded-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>

        {/* Skip button (new) */}
        <Button variant="outline" onClick={handleNext} className="rounded-full button-wavy">
          Skip
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Show progress tracking buttons when card is flipped */}
        {isFlipped && (
          <>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 rounded-full"
              onClick={handleMarkAsUnknown}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />I Don't Know
            </Button>

            <Button className="bg-green-600 hover:bg-green-700 rounded-full button-3d" onClick={handleMarkAsKnown}>
              <ThumbsUp className="mr-2 h-4 w-4" />I Know This
            </Button>
          </>
        )}

        {/* Show reveal button when card is not flipped */}
        {!isFlipped && (
          <Button onClick={handleFlip} className="rounded-full fun-button-primary">
            Reveal Answer
          </Button>
        )}
      </div>

      {/* Login prompt for unauthenticated users */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="mt-8 p-4 rounded-2xl bg-blue-50 text-center">
          <p className="mb-4 font-medium text-blue-800">
            Sign in to track your progress and see personalized recommendations
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="sm" className="rounded-full fun-button-primary">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full button-wavy">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Footer with explanation of asterisk marking */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          * Questions marked with "65+ Years" are specifically for applicants who are 65 years or older and have been a
          legal permanent resident for 20 or more years.
        </p>
      </div>
    </div>
  )
}

// Component for filter options in the filter sheet
function FilterOption({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
