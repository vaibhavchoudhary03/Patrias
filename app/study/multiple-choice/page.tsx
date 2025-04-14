"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { questions, type Question } from "@/lib/questions"
import { Progress } from "@/components/ui/progress"
import { useProgress } from "@/contexts/progress-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function MultipleChoicePage() {
  // State for managing the quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Get progress tracking functions from context
  const { recordAttempt, isProgressAvailable } = useProgress()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Initialize quiz with 10 random questions
  useEffect(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    setQuizQuestions(shuffled.slice(0, 10))
  }, [])

  // Generate multiple choice options for the current question
  useEffect(() => {
    if (quizQuestions.length === 0) return

    const currentQuestion = quizQuestions[currentQuestionIndex]
    const correctAnswer = currentQuestion.answers[0]

    // Get incorrect options from other questions
    const otherAnswers = questions
      .filter((q) => q.id !== currentQuestion.id)
      .map((q) => q.answers[0])
      .filter((a) => a !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    // Combine correct and incorrect answers and shuffle
    const allOptions = [correctAnswer, ...otherAnswers].sort(() => 0.5 - Math.random())

    setOptions(allOptions)
    setSelectedAnswer("")
    setIsAnswered(false)
  }, [currentQuestionIndex, quizQuestions])

  // Handle answer submission
  const handleSubmit = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex]
    const isAnswerCorrect = currentQuestion.answers.includes(selectedAnswer)

    setIsCorrect(isAnswerCorrect)
    setIsAnswered(true)

    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      toast({
        title: "Sign in required",
        description: "Create an account or sign in to track your progress",
        variant: "default",
      })
    } else {
      recordAttempt(currentQuestion.id, "multipleChoice", isAnswerCorrect, currentQuestion.category)
    }

    if (isAnswerCorrect) {
      setScore(score + 1)
    }
  }

  // Move to the next question
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Restart the quiz with new questions
  const handleRestart = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    setQuizQuestions(shuffled.slice(0, 10))
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer("")
    setIsAnswered(false)
  }

  // Show loading state while questions are being prepared
  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-[400px]">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1

  return (
    <div className="container mx-auto px-6 md:px-8 py-12">
      {/* Header with navigation and score */}
      <div className="mb-8 flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-medium">
            Score: {score}/{quizQuestions.length}
          </span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart Quiz
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-3">
          <span className="text-base font-medium">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          <span className="text-base font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-4 rounded-full" />
      </div>

      {/* Question card with multiple choice options */}
      <Card className="mb-12 bubble-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Multiple Choice Question
            </CardTitle>
            {currentQuestion.isForElderlyOnly && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full">65+ Years*</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          {/* Radio group for answer options */}
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {options.map((option, index) => {
              const isCorrectAnswer = currentQuestion.answers.includes(option)
              const showCorrect = isAnswered && isCorrectAnswer
              const showIncorrect = isAnswered && selectedAnswer === option && !isCorrectAnswer

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-2xl border p-4 ${
                    showCorrect ? "border-green-500 bg-green-50" : showIncorrect ? "border-red-500 bg-red-50" : ""
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>

                  {/* Show correct/incorrect indicators after answering */}
                  {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* Show submit button before answering, next/restart after answering */}
          {!isAnswered ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full rounded-full">
              Submit Answer
            </Button>
          ) : (
            <div className="w-full">
              {/* Feedback on answer correctness */}
              <div
                className={`mb-4 rounded-2xl p-3 ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {isCorrect ? (
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    <span>Correct! Well done.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-2">
                      <XCircle className="mr-2 h-5 w-5" />
                      <span>Incorrect. The correct answer(s):</span>
                    </div>
                    <ul className="ml-8 list-disc">
                      {currentQuestion.answers.map((answer, i) => (
                        <li key={i}>{answer}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Next question or restart quiz button */}
              {isLastQuestion ? (
                <Button onClick={handleRestart} className="w-full rounded-full">
                  Restart Quiz
                </Button>
              ) : (
                <Button onClick={handleNext} className="w-full rounded-full">
                  Next Question
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Login prompt for unauthenticated users */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="mb-8 p-4 rounded-2xl bg-primary/10 text-center">
          <p className="mb-4 font-medium">Sign in to track your progress and see personalized recommendations</p>
          <div className="flex justify-center gap-4">
            <Button asChild size="sm" className="rounded-full">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Footer with explanation of asterisk marking */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          * Questions marked with "65+ Years" are specifically for applicants who are 65 years or older and have been a
          legal permanent resident for 20 or more years.
        </p>
      </div>
    </div>
  )
}
