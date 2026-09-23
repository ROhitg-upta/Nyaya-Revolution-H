# Nyaya Revolution — API & Service Specification

**Version:** 1.0.0  
**Pattern:** Next.js Server Actions + Data Service Layer  
**Validation:** Zod 3.x  
**Authentication:** Supabase SSR Session Cookies  

---

## 1. Overview & Protocol Conventions

Nyaya Revolution uses type-safe Next.js Server Actions for state mutations and a dual-mode database service layer for data access. 

### Standard Action Return Shape
```ts
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Standard HTTP / Action Status Codes & Errors
- `UNAUTHENTICATED`: Caller is not logged in when user identity is mandatory.
- `INVALID_INPUT`: Request payload failed Zod schema validation.
- `NOT_FOUND`: Target resource (situation, article, lesson) does not exist.
- `UNAUTHORIZED`: Caller does not possess sufficient role privileges (`citizen` attempting admin action).
- `DATABASE_ERROR`: Underlying PostgreSQL constraint violation or RLS rejection.

---

## 2. Server Actions API

### 2.1 Learning & Progress Actions

#### `updateLessonProgressAction(rawInput: ProgressUpdateValues): Promise<ActionResult<{ completed: boolean }>>`
Records or updates the completion status of a lesson for the authenticated user.
- **Input Schema:**
  ```ts
  {
    journeySlug: string;       // Non-empty slug
    lessonSlug: string;        // Non-empty slug
    completed: boolean;        // Completion state
    timeSpentSeconds?: number; // Time elapsed
    quizScore?: number;        // Optional quiz score (0-100)
  }
  ```
- **Behavior:**
  - Validates payload against `progressUpdateSchema`.
  - Upserts into `user_lesson_progress`.
  - Revalidates `/learn`, `/learn/[journeySlug]`, `/profile`.
- **Response:**
  ```json
  { "success": true, "data": { "completed": true } }
  ```

#### `bookmarkItemAction(rawInput: BookmarkValues): Promise<ActionResult<{ bookmarked: boolean }>>`
Toggles a bookmark for a legal situation, article, case study, or act.
- **Input Schema:**
  ```ts
  {
    targetType: "situation" | "article" | "case_study" | "act" | "glossary";
    targetSlug: string;
    collectionId?: string; // Optional collection UUID
  }
  ```
- **Behavior:**
  - Toggles entry in `bookmarks` table.
  - Returns `true` if newly bookmarked, `false` if removed.
- **Response:**
  ```json
  { "success": true, "data": { "bookmarked": true } }
  ```

---

### 2.2 Quiz & Assessment Actions

#### `submitQuizAttemptAction(rawInput: QuizSubmissionValues): Promise<{ success: boolean; data?: QuizSubmissionResult; error?: string }>`
Submits answers, records the score, updates XP, and computes user level atomically.
- **Input Schema:**
  ```ts
  {
    journeySlug: string;
    lessonSlug: string;
    score: number;             // Non-negative integer
    totalQuestions: number;    // Positive integer >= 1
    xpEarned: number;          // XP to award
    answers?: Array<{
      questionIndex: number;
      selectedOption: number;
      isCorrect: boolean;
    }>;
  }
  ```
- **Behavior:**
  - Validates payload via `quizSubmissionSchema`.
  - Executes atomic RPC `record_quiz_attempt` on Supabase PostgreSQL.
  - Revalidates cache across learning paths and profile.
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "score": 4,
      "totalQuestions": 5,
      "xpEarned": 100,
      "passed": true
    }
  }
  ```

---

### 2.3 Community & Citizen Voice Actions

#### `submitCitizenStoryAction(rawInput: CitizenStoryValues): Promise<ActionResult<{ storyId: string; status: string }>>`
Submits a citizen resolution story for community review and publication.
- **Input Schema:**
  ```ts
  {
    title: string;             // 5 - 200 chars
    category: string;          // Legal domain category
    whatHappened: string;      // 20 - 3000 chars
    actionTaken: string;       // 10 - 2000 chars
    legalOutcome: string;      // 10 - 2000 chars
    resolutionStatus: "resolved" | "ongoing" | "mediated";
    statutoryBacking?: string; // Optional Act / Section citation
  }
  ```
- **Behavior:**
  - Validates payload against `citizenStorySchema`.
  - Stores story with `moderation_status = 'pending'`.
- **Response:**
  ```json
  {
    "success": true,
    "data": { "storyId": "a1b2c3d4-...", "status": "pending" }
  }
  ```

#### `toggleStoryHelpfulAction(storyId: string, helpful?: boolean): Promise<ActionResult<{ helpfulCount: number }>>`
Increments or decrements the helpful counter for a published citizen story.
- **Behavior:**
  - Calls PostgreSQL RPC `increment_story_helpful` atomically.
- **Response:**
  ```json
  { "success": true, "data": { "helpfulCount": 43 } }
  ```

#### `submitContentFeedbackAction(rawInput: ContentFeedbackValues): Promise<ActionResult<{ id: string }>>`
Allows citizens or legal professionals to report factual issues, typos, or outdated provisions.
- **Input Schema:**
  ```ts
  {
    contentType: "situation" | "article" | "case_study" | "lesson" | "glossary";
    contentSlug: string;
    feedbackType: "helpful" | "unclear" | "outdated" | "typo" | "incorrect";
    comment?: string;
  }
  ```
- **Behavior:**
  - Records report in `content_reports` table for administrative review.
- **Response:**
  ```json
  { "success": true, "data": { "id": "e5f6g7h8-..." } }
  ```

---

### 2.4 AI Learning Engine Actions (`src/actions/ai.actions.ts`)

#### `askAILearningEngineAction(rawInput: AIQueryValues): Promise<ActionResult<AILearningResponse>>`
Performs normalized query analysis, verified knowledge retrieval, and grounded Gemini 2.0 reasoning.
- **Input:** `{ query: string, responseMode?: "eli15" | "detailed" | "legal" | "summary" | "step-by-step" }`
- **Output:** Validated `AILearningResponse` with summary, keyPoints, legal concepts, practice question, and `sources` array.

#### `explainConceptAction(rawInput: ExplainConceptValues): Promise<ActionResult<AILearningResponse>>`
Generates beginner or intermediate explanations for legal doctrines and articles.

#### `simplifyLessonAction(rawInput: SimplifyLessonValues): Promise<ActionResult<AILearningResponse>>`
Synthesizes dense statutory lesson content into citizen takeaways and myth checks.

#### `getRecommendationsAction(context?: RecommendationContext): Promise<ActionResult<LearningRecommendation[]>>`
Deterministic and situation-driven recommendations for next lessons and practice scenarios.

#### `generatePracticeScenarioAction(rawInput: GenerateScenarioValues): Promise<ActionResult<GeneratedScenarioResult>>`
Creates 4-option practice scenarios. Automatically marked as `governanceStatus: "draft"` awaiting human review.

---

## 3. Data Service Contracts (`src/services/db/`)

### 3.1 `SituationsService`
- `getCategories(): Promise<SituationCategory[]>`
- `getSituations(category?: SituationCategoryId): Promise<Situation[]>`
- `getSituationBySlug(slug: string): Promise<Situation | null>`
- `searchSituations(query: string): Promise<Situation[]>`

### 3.2 `LegalKnowledgeService`
- `getPublishedArticles(): Promise<LawArticle[]>`
- `getArticleBySlug(slug: string): Promise<LawArticle | null>`
- `getPublishedCaseStudies(): Promise<CaseStudy[]>`
- `getCaseStudyBySlug(slug: string): Promise<CaseStudy | null>`
- `getGlossaryTerms(): Promise<GlossaryTerm[]>`

### 3.3 `LearningService`
- `getJourneys(): Promise<Journey[]>`
- `getJourneyBySlug(slug: string): Promise<Journey | null>`
- `getLesson(journeySlug: string, lessonSlug: string): Promise<Lesson | null>`

### 3.4 `ProgressService`
- `getUserStreak(userId: string): Promise<UserStreakData>`
- `completeLesson(userId: string, lessonId: string): Promise<boolean>`
- `updateLessonProgress(userId: string, journeySlug: string, lessonSlug: string, completed: boolean): Promise<boolean>`
- `submitQuizAttempt(quizId: string, score: number, maxScore: number, passed: boolean, xpReward: number): Promise<{ success: boolean; attemptId?: string }>`
- `recordQuizAttempt(userId: string, journeySlug: string, lessonSlug: string, score: number, totalQuestions: number, xpEarned: number): Promise<boolean>`

### 3.5 `CommunityService`
- `getStories(category?: string): Promise<CitizenStory[]>`
- `toggleHelpful(storyId: string, helpful: boolean): Promise<number>`

### 3.6 `GovernanceService`
- `logAuditEvent(payload: AuditEventPayload): Promise<boolean>`
- `logVerification(payload: VerificationLogPayload): Promise<boolean>`
