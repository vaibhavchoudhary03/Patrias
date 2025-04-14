"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Category } from "@/lib/questions"
import { useAuth } from "@/contexts/auth-context"

// Define types for our progress tracking
type StudyMode = "flashCards" | "multipleChoice" | "fillInBlank"

interface QuestionProgress {
  questionId: number
  attempted: number
  correct: number
  lastAttempted: Date | null
}

interface CategoryProgress {
  category: Category
  attempted: number
  correct: number
}

interface StudyModeProgress {
  mode: StudyMode
  questionsAttempted: number
  questionsCorrect: number
}

// Define the shape of our context
interface ProgressContextType {
  questionProgress: Record<number, QuestionProgress>
  categoryProgress: Record<Category, CategoryProgress>
  studyModeProgress: Record<StudyMode, StudyModeProgress>
  recordAttempt: (questionId: number, mode: StudyMode, isCorrect: boolean, category?: Category) => void
  getCompletionPercentage: (mode?: StudyMode) => number
  getAccuracyPercentage: (mode?: StudyMode) => number
  getCategoryCompletionPercentage: (category: Category) => number
  getCategoryAccuracyPercentage: (category: Category) => number
  resetProgress: () => void
  isProgressAvailable: boolean
}

// Create the context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Get authentication state
  const { user, isAuthenticated } = useAuth()

  // Initialize state for tracking progress at different levels
  const [questionProgress, setQuestionProgress] = useState<Record<number, QuestionProgress>>({})
  const [categoryProgress, setCategoryProgress] = useState<Record<Category, CategoryProgress>>({
    AMERICAN_GOVERNMENT: { category: "AMERICAN_GOVERNMENT", attempted: 0, correct: 0 },
    AMERICAN_HISTORY: { category: "AMERICAN_HISTORY", attempted: 0, correct: 0 },
    INTEGRATED_CIVICS: { category: "INTEGRATED_CIVICS", attempted: 0, correct: 0 },
  })
  const [studyModeProgress, setStudyModeProgress] = useState<Record<StudyMode, StudyModeProgress>>({
    flashCards: { mode: "flashCards", questionsAttempted: 0, questionsCorrect: 0 },
    multipleChoice: { mode: "multipleChoice", questionsAttempted: 0, questionsCorrect: 0 },
    fillInBlank: { mode: "fillInBlank", questionsAttempted: 0, questionsCorrect: 0 },
  })

  // Load progress from localStorage on initial render or when user changes
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear progress data when not authenticated
      setQuestionProgress({})
      setCategoryProgress({
        AMERICAN_GOVERNMENT: { category: "AMERICAN_GOVERNMENT", attempted: 0, correct: 0 },
        AMERICAN_HISTORY: { category: "AMERICAN_HISTORY", attempted: 0, correct: 0 },
        INTEGRATED_CIVICS: { category: "INTEGRATED_CIVICS", attempted: 0, correct: 0 },
      })
      setStudyModeProgress({
        flashCards: { mode: "flashCards", questionsAttempted: 0, questionsCorrect: 0 },
        multipleChoice: { mode: "multipleChoice", questionsAttempted: 0, questionsCorrect: 0 },
        fillInBlank: { mode: "fillInBlank", questionsAttempted: 0, questionsCorrect: 0 },
      })
      return
    }

    // Use user ID as part of the storage key for user-specific progress
    const userId = user?.id || "anonymous"

    const savedQuestionProgress = localStorage.getItem(`patrias_question_progress_${userId}`)
    const savedCategoryProgress = localStorage.getItem(`patrias_category_progress_${userId}`)
    const savedStudyModeProgress = localStorage.getItem(`patrias_study_mode_progress_${userId}`)

    if (savedQuestionProgress) {
      setQuestionProgress(JSON.parse(savedQuestionProgress))
    }
    if (savedCategoryProgress) {
      setCategoryProgress(JSON.parse(savedCategoryProgress))
    }
    if (savedStudyModeProgress) {
      setStudyModeProgress(JSON.parse(savedStudyModeProgress))
    }
  }, [isAuthenticated, user])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) return

    const userId = user?.id || "anonymous"

    localStorage.setItem(`patrias_question_progress_${userId}`, JSON.stringify(questionProgress))
    localStorage.setItem(`patrias_category_progress_${userId}`, JSON.stringify(categoryProgress))
    localStorage.setItem(`patrias_study_mode_progress_${userId}`, JSON.stringify(studyModeProgress))
  }, [questionProgress, categoryProgress, studyModeProgress, isAuthenticated, user])

  // Record an attempt at answering a question
  const recordAttempt = (questionId: number, mode: StudyMode, isCorrect: boolean, category?: Category) => {
    if (!isAuthenticated) return // Don't record progress if not authenticated

    // Update question progress
    setQuestionProgress((prev) => {
      const existing = prev[questionId] || { questionId, attempted: 0, correct: 0, lastAttempted: null }
      return {
        ...prev,
        [questionId]: {
          ...existing,
          attempted: existing.attempted + 1,
          correct: existing.correct + (isCorrect ? 1 : 0),
          lastAttempted: new Date(),
        },
      }
    })

    // Update category progress if provided
    if (category) {
      setCategoryProgress((prev) => {
        const existing = prev[category] || { category, attempted: 0, correct: 0 }
        return {
          ...prev,
          [category]: {
            ...existing,
            attempted: existing.attempted + 1,
            correct: existing.correct + (isCorrect ? 1 : 0),
          },
        }
      })
    }

    // Update study mode progress
    setStudyModeProgress((prev) => {
      const existing = prev[mode]
      return {
        ...prev,
        [mode]: {
          ...existing,
          questionsAttempted: existing.questionsAttempted + 1,
          questionsCorrect: existing.questionsCorrect + (isCorrect ? 1 : 0),
        },
      }
    })
  }

  // Calculate completion percentage for a study mode or overall
  const getCompletionPercentage = (mode?: StudyMode): number => {
    if (!isAuthenticated) return 0 // Return 0 if not authenticated

    if (mode) {
      // For a specific mode, calculate unique questions attempted / 100
      const uniqueQuestionsAttempted = Object.values(questionProgress).filter((q) => q.attempted > 0).length
      return Math.min(Math.round((uniqueQuestionsAttempted / 100) * 100), 100)
    } else {
      // For overall, average across all modes
      const totalAttempted = Object.values(studyModeProgress).reduce((sum, mode) => sum + mode.questionsAttempted, 0)
      return Math.min(Math.round((totalAttempted / 300) * 100), 100) // 100 questions × 3 modes
    }
  }

  // Calculate accuracy percentage for a study mode or overall
  const getAccuracyPercentage = (mode?: StudyMode): number => {
    if (!isAuthenticated) return 0 // Return 0 if not authenticated

    if (mode) {
      const modeProgress = studyModeProgress[mode]
      return modeProgress.questionsAttempted > 0
        ? Math.round((modeProgress.questionsCorrect / modeProgress.questionsAttempted) * 100)
        : 0
    } else {
      // Overall accuracy across all modes
      const totalAttempted = Object.values(studyModeProgress).reduce((sum, mode) => sum + mode.questionsAttempted, 0)
      const totalCorrect = Object.values(studyModeProgress).reduce((sum, mode) => sum + mode.questionsCorrect, 0)

      return totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    }
  }

  // Calculate completion percentage for a specific category
  const getCategoryCompletionPercentage = (category: Category): number => {
    if (!isAuthenticated) return 0 // Return 0 if not authenticated

    // Count unique questions attempted in this category (assuming 33-34 questions per category)
    const questionsInCategory = category === "AMERICAN_GOVERNMENT" ? 34 : 33
    const uniqueQuestionsAttempted = Object.values(questionProgress).filter((q) => q.attempted > 0).length

    return Math.min(Math.round((uniqueQuestionsAttempted / questionsInCategory) * 100), 100)
  }

  // Calculate accuracy percentage for a specific category
  const getCategoryAccuracyPercentage = (category: Category): number => {
    if (!isAuthenticated) return 0 // Return 0 if not authenticated

    const catProgress = categoryProgress[category]
    return catProgress.attempted > 0 ? Math.round((catProgress.correct / catProgress.attempted) * 100) : 0
  }

  // Reset all progress data
  const resetProgress = () => {
    if (!isAuthenticated) return // Don't reset if not authenticated

    setQuestionProgress({})
    setCategoryProgress({
      AMERICAN_GOVERNMENT: { category: "AMERICAN_GOVERNMENT", attempted: 0, correct: 0 },
      AMERICAN_HISTORY: { category: "AMERICAN_HISTORY", attempted: 0, correct: 0 },
      INTEGRATED_CIVICS: { category: "INTEGRATED_CIVICS", attempted: 0, correct: 0 },
    })
    setStudyModeProgress({
      flashCards: { mode: "flashCards", questionsAttempted: 0, questionsCorrect: 0 },
      multipleChoice: { mode: "multipleChoice", questionsAttempted: 0, questionsCorrect: 0 },
      fillInBlank: { mode: "fillInBlank", questionsAttempted: 0, questionsCorrect: 0 },
    })

    const userId = user?.id || "anonymous"
    localStorage.removeItem(`patrias_question_progress_${userId}`)
    localStorage.removeItem(`patrias_category_progress_${userId}`)
    localStorage.removeItem(`patrias_study_mode_progress_${userId}`)
  }

  // Provide the context values to children
  return (
    <ProgressContext.Provider
      value={{
        questionProgress,
        categoryProgress,
        studyModeProgress,
        recordAttempt,
        getCompletionPercentage,
        getAccuracyPercentage,
        getCategoryCompletionPercentage,
        getCategoryAccuracyPercentage,
        resetProgress,
        isProgressAvailable: isAuthenticated,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

// Custom hook to use the progress context
export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
