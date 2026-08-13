/**
 * AI Learning Companion domain types.
 *
 * Shapes the chat, conversation, structured response, and prompt system.
 * The frontend owns these types — the AI service layer maps provider-specific
 * responses (Gemini, OpenAI, etc.) into these shapes.
 */
import type { LucideIcon } from "@/lib/icons";

export type ResponseModeId =
  | "eli15"
  | "detailed"
  | "legal"
  | "summary"
  | "step-by-step";

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
  rights: string[];
  laws: LawReference[];
  immediateActions: string[];
  documentsRequired: string[];
  authorities: AuthorityContact[];
  commonMistakes: string[];
  learningJourney?: LearningJourneyRef;
  quiz?: QuizRef;
  professionalHelp?: string;
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
