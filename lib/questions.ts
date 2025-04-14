// Define the structure for citizenship test questions
export interface Question {
  id: number
  question: string
  answers: string[]
  category: Category
  subcategory: Subcategory
  isForElderlyOnly: boolean
}

// Main categories from the USCIS test
export type Category = "AMERICAN_GOVERNMENT" | "AMERICAN_HISTORY" | "INTEGRATED_CIVICS"

// Subcategories for more specific classification
export type Subcategory =
  | "PRINCIPLES_OF_AMERICAN_DEMOCRACY"
  | "SYSTEM_OF_GOVERNMENT"
  | "RIGHTS_AND_RESPONSIBILITIES"
  | "COLONIAL_PERIOD_AND_INDEPENDENCE"
  | "1800S"
  | "RECENT_AMERICAN_HISTORY"
  | "GEOGRAPHY"
  | "SYMBOLS"
  | "HOLIDAYS"

// The complete list of 100 citizenship test questions
export const questions: Question[] = [
  {
    id: 1,
    question: "What is the supreme law of the land?",
    answers: ["the Constitution"],
    category: "AMERICAN_GOVERNMENT",
    subcategory: "PRINCIPLES_OF_AMERICAN_DEMOCRACY",
    isForElderlyOnly: false,
  },
  {
    id: 2,
    question: "What does the Constitution do?",
    answers: ["sets up the government", "defines the government", "protects basic rights of Americans"],
    category: "AMERICAN_GOVERNMENT",
    subcategory: "PRINCIPLES_OF_AMERICAN_DEMOCRACY",
    isForElderlyOnly: false,
  },
  {
    id: 3,
    question: "The idea of self-government is in the first three words of the Constitution. What are these words?",
    answers: ["We the People"],
    category: "AMERICAN_GOVERNMENT",
    subcategory: "PRINCIPLES_OF_AMERICAN_DEMOCRACY",
    isForElderlyOnly: false,
  },
  {
    id: 4,
    question: "What is an amendment?",
    answers: ["a change (to the Constitution)", "an addition (to the Constitution)"],
    category: "AMERICAN_GOVERNMENT",
    subcategory: "PRINCIPLES_OF_AMERICAN_DEMOCRACY",
    isForElderlyOnly: false,
  },
  {
    id: 5,
    question: "What do we call the first ten amendments to the Constitution?",
    answers: ["the Bill of Rights"],
    category: "AMERICAN_GOVERNMENT",
    subcategory: "PRINCIPLES_OF_AMERICAN_DEMOCRACY",
    isForElderlyOnly: false,
  },
  {
    id: 6,
    question: "What is one right or freedom from the First Amendment?",
    answers: ["speech", "religion", "assembly", "press", "petition the government"],
    category: "AMERICAN_GOVERNMENT",
    subcategory: "PRINCIPLES_OF_AMERICAN_DEMOCRACY",
    isForElderlyOnly: true,
  },
  // Add more questions here...
  {
    id: 94,
    question: "What is the capital of the United States?",
    answers: ["Washington, D.C."],
    category: "INTEGRATED_CIVICS",
    subcategory: "GEOGRAPHY",
    isForElderlyOnly: true,
  },
  {
    id: 95,
    question: "Where is the Statue of Liberty?",
    answers: ["New York (Harbor)", "Liberty Island", "New Jersey", "near New York City", "on the Hudson (River)"],
    category: "INTEGRATED_CIVICS",
    subcategory: "GEOGRAPHY",
    isForElderlyOnly: true,
  },
  {
    id: 96,
    question: "Why does the flag have 13 stripes?",
    answers: ["because there were 13 original colonies", "because the stripes represent the original colonies"],
    category: "INTEGRATED_CIVICS",
    subcategory: "SYMBOLS",
    isForElderlyOnly: false,
  },
  {
    id: 97,
    question: "Why does the flag have 50 stars?",
    answers: [
      "because there is one star for each state",
      "because each star represents a state",
      "because there are 50 states",
    ],
    category: "INTEGRATED_CIVICS",
    subcategory: "SYMBOLS",
    isForElderlyOnly: true,
  },
  {
    id: 98,
    question: "What is the name of the national anthem?",
    answers: ["The Star-Spangled Banner"],
    category: "INTEGRATED_CIVICS",
    subcategory: "SYMBOLS",
    isForElderlyOnly: false,
  },
  {
    id: 99,
    question: "When do we celebrate Independence Day?",
    answers: ["July 4"],
    category: "INTEGRATED_CIVICS",
    subcategory: "HOLIDAYS",
    isForElderlyOnly: true,
  },
  {
    id: 100,
    question: "Name two national U.S. holidays.",
    answers: [
      "New Year's Day",
      "Martin Luther King, Jr. Day",
      "Presidents' Day",
      "Memorial Day",
      "Independence Day",
      "Labor Day",
      "Columbus Day",
      "Veterans Day",
      "Thanksgiving",
      "Christmas",
    ],
    category: "INTEGRATED_CIVICS",
    subcategory: "HOLIDAYS",
    isForElderlyOnly: false,
  },
]

// Helper functions to filter questions by different criteria

// Get questions by main category
export function getQuestionsByCategory(category: Category): Question[] {
  return questions.filter((q) => q.category === category)
}

// Get questions by subcategory
export function getQuestionsBySubcategory(subcategory: Subcategory): Question[] {
  return questions.filter((q) => q.subcategory === subcategory)
}

// Get questions specifically for elderly applicants (65+ years and 20+ years as permanent resident)
export function getElderlyOnlyQuestions(): Question[] {
  return questions.filter((q) => q.isForElderlyOnly)
}

// Get a random selection of questions (useful for quizzes)
export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
