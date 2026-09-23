/**
 * AI Learning Companion domain types.
 *
 * Shapes the chat, conversation, structured response, and prompt system.
 * The frontend owns these types — the AI service layer maps provider-specific
 * responses (Gemini, OpenAI, etc.) into these shapes.
 */
import type { LucideIcon } from "@/lib/icons";
import type { ContentSource } from "./legal-content";

export type ResponseModeId =
  | "eli15" | "detailed" | "legal" | "summary" | "step-by-step";

export interface ResponseMode {
  id: ResponseModeId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** Structured response (assistant messages only). */
  structured?: StructuredResponse;
  timestamp: number;
  /** Follow-up suggestions attached to this message. */
  followUps?: FollowUpSuggestion[];
  isBookmarked?: boolean;
}

export interface StructuredResponse {
  situationSummary: string;
  relevantConcept?: string;
  whatYouShouldUnderstand?: string[];
  rights: string[];
  laws: LawReference[];
  immediateActions: string[];
  possibleGeneralNextSteps?: string[];
  documentsRequired: string[];
  authorities: AuthorityContact[];
  commonMistakes: string[];
  practiceQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    xp?: number;
  };
  learningJourney?: LearningJourneyRef;
  quiz?: QuizRef;
  source?: ContentSource;
  professionalHelp?: string;

  // Grounding & verification indicators
  isGroundingVerified?: boolean;
  groundedArticles?: {
    slug: string;
    title: string;
    articleOrSection: string;
  }[];
  groundedLaws?: {
    slug: string;
    title: string;
    shortTitle: string;
  }[];
  groundedCases?: {
    slug: string;
    title: string;
    citation: string;
  }[];
}

export interface LawReference {
  name: string;
  section: string;
  description: string;
}

export interface AuthorityContact {
  name: string;
  description: string;
  contact?: string;
}

export interface LearningJourneyRef {
  title: string;
  slug: string;
  lessons: number;
}

export interface QuizRef {
  title: string;
  questions: number;
  slug: string;
}

export interface FollowUpSuggestion {
  type: "situation" | "course" | "quiz" | "story";
  label: string;
  description: string;
  href?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  responseMode: ResponseModeId;
}

export interface AIStreamChunk {
  type: "text" | "structured" | "follow-ups" | "done" | "error";
  content?: string;
  structured?: StructuredResponse;
  followUps?: FollowUpSuggestion[];
  error?: string;
}

export interface UserContext {
  name?: string;
  occupation?: string;
  ageGroup?: string;
  language?: string;
  interests?: string[];
  learningGoals?: string[];
}

export interface PromptContext {
  systemPrompt: string;
  userContext: UserContext;
  responseMode: ResponseModeId;
  conversationHistory: ChatMessage[];
  currentQuestion: string;
  situationSlug?: string;
}

export interface AISourceReference {
  id: string;
  type: "article" | "situation" | "case_study" | "act" | "lesson" | "glossary";
  title: string;
  citationOrSection?: string;
  publisher?: string;
  url?: string;
  verificationStatus: "verified" | "published";
  relevanceScore?: number;
}

export interface SituationClassification {
  categoryIds: string[];
  conceptIds: string[];
  situationType?: string;
  confidence?: number;
  missingContext?: string[];
  isSensitive?: boolean;
}

export interface AILearningResponse {
  summary: string;
  explanation?: string;
  keyPoints?: string[];
  relevantConcepts?: string[];
  suggestedLessons?: {
    title: string;
    journeySlug: string;
    lessonSlug: string;
  }[];
  possibleNextSteps?: string[];
  thingsToKeepInMind?: string[];
  practiceQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    xp?: number;
  };
  sources: AISourceReference[];
  educationalNotice?: string;
  isSensitive?: boolean;
  professionalHelpRecommended?: boolean;
}

export interface LearningRecommendation {
  type: "next_lesson" | "revision" | "practice_quiz" | "scenario";
  title: string;
  description: string;
  journeySlug: string;
  lessonSlug?: string;
  quizSlug?: string;
  rationale: string;
  xpReward?: number;
}

export interface PracticeScenario {
  id: string;
  title: string;
  concept: string;
  statutoryBacking?: string;
  situationText: string;
  options: {
    id: string;
    text: string;
    isRecommended: boolean;
    rationale: string;
  }[];
  learningTakeaway: string;
  governanceStatus: "draft" | "needs_review" | "approved";
}

export interface RetrievedKnowledgeItem {
  id: string;
  type: "article" | "situation" | "case_study" | "act" | "lesson" | "glossary";
  title: string;
  slug: string;
  snippet: string;
  fullText?: string;
  category?: string;
  citation?: string;
  publisher?: string;
  url?: string;
  verificationStatus: "verified" | "published";
  score: number;
}
