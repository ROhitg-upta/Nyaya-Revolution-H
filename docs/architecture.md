# Nyaya Revolution — System Architecture & Infrastructure

**Architecture Version:** 2.0.0  
**Framework:** Next.js 16.3 (App Router, Turbopack, React Server Components)  
**Database & Auth:** Supabase PostgreSQL 15+, Supabase SSR Auth  
**Runtime:** Node.js / Edge Runtime  
**Deployment Target:** Vercel / Docker Container / AWS ECS  

---

## 1. System Overview & Architectural Topology

Nyaya Revolution is architected as a high-performance legal awareness and education platform for Indian citizens. It bridges complex statutory jurisprudence with accessible, interactive citizen experiences.

```
                              [ Citizen User / Advocate / Guest ]
                                               │
                                               ▼
                              ┌─────────────────────────────────┐
                              │     Cloudflare / CDN Edge       │
                              │  (SSL, DDoS Protection, Caching)│
                              └────────────────┬────────────────┘
                                               │
                                               ▼
                              ┌─────────────────────────────────┐
                              │      Next.js 16 App Router      │
                              │  - 151 Pre-rendered SSG Pages   │
                              │  - Dynamic SSR Routes           │
                              │  - Type-safe Server Actions     │
                              │  - Turbopack Engine             │
                              └───────┬─────────────────┬───────┘
                                      │                 │
              [Browser / Client-side] │                 │ [Server Components / Actions]
                                      ▼                 ▼
          ┌───────────────────────────────┐         ┌───────────────────────────────┐
          │  Supabase Browser Client      │         │  Supabase Server SSR Client   │
          │  (Anon Key + Cookie Session)  │         │  (Cookie-based SSR Auth)      │
          └───────────────┬───────────────┘         └───────────────┬───────────────┘
                          │                                         │
                          └───────────────────┬─────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────────┐
                              │    Data Service Adapter Layer   │
                              │       (src/services/db/)        │
                              └───────┬─────────────────┬───────┘
                                      │                 │
             [Live Supabase Configured]                 │ [Offline / Build-Time Fallback]
                                      ▼                 ▼
          ┌───────────────────────────────┐         ┌───────────────────────────────┐
          │   Supabase PostgreSQL 15+     │         │   Verified Static Fixtures    │
          │  - Row-Level Security (RLS)   │         │  - 500+ Legal Situations      │
          │  - Full-Text Search (tsvector)│         │  - Constitutional Articles    │
          │  - Atomic Triggers & RPCs     │         │  - Case Studies & Quizzes     │
          └───────────────┬───────────────┘         └───────────────────────────────┘
                          │
                          │ [Admin-Only Background Tasks]
                          ▼
          ┌───────────────────────────────┐
          │     Supabase Admin Client     │
          │  (Service Role Key - Server)  │
          │  - Content Moderation Queue   │
          │  - Immutable Audit Logging    │
          └───────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### 2.1 Dual-Mode Resilient Data Adapter Pattern
A core tenet of Nyaya Revolution is zero-downtime reliability and instant page delivery. In CI/CD pipelines, offline demonstration environments, or cold starts:
- The data access services (`src/services/db/*.service.ts`) evaluate `publicEnv.isSupabaseConfigured`.
- When configured with valid credentials, queries run against live PostgreSQL tables with user-scoped Row Level Security.
- If unconfigured or if a network partition occurs, services gracefully fall back to verified static data fixtures (`src/constants/`).
- This allows all **151 static/SSG routes** (`/situations/*`, `/laws/*`, `/case-studies/*`, `/learn/*`) to prerender cleanly during `next build` without requiring an active external database connection.

### 2.2 Security Boundaries & Key Isolation
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Exposed to the client browser for session hydration, public reads (published laws/situations), and user-scoped RLS operations.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Strictly isolated on the server (`serverEnv.supabaseServiceRoleKey`). This key bypasses Row Level Security and is restricted exclusively to administrative backend routines and moderation triggers. It is never exposed in browser bundles, public headers, or client-rendered templates.
- **Strict Content Verification**: All legal articles, acts, and statutory procedures require verified source citations (India Code, Supreme Court of India, Legislative Department). No AI generation or user edit is displayed publicly without passing content verification.

---

## 3. Data Flow Architecture

### 3.1 Quiz Attempt & Gamification Flow
```
User completes quiz in UI
         │
         ▼
`submitQuizAttemptAction(rawInput)` (Server Action)
         │
         ▼
Zod Schema Validation (`quizSubmissionSchema`)
         │
         ▼
`createSupabaseServerClient()` reads session cookie
         │
         ▼
Invoke Supabase RPC: `record_quiz_attempt(p_quiz_id, p_score, p_max_score, p_passed, p_xp)`
         │  (Atomic PostgreSQL Transaction)
         ├── Insert into `quiz_attempts` table
         └── Update `profiles.xp_points` + recalculate `profiles.level`
         │
         ▼
`revalidatePath('/learn')` + `revalidatePath('/profile')`
         │
         ▼
Return `{ success: true, data: { score, passed, xpEarned } }`
```

### 3.2 Citizen Story Community Submission Flow
```
Citizen writes real-life story / resolution
         │
         ▼
`submitCitizenStoryAction(rawInput)` (Server Action)
         │
         ▼
Validate with `citizenStorySchema` (min characters, required fields)
         │
         ▼
Verify author identity via Supabase Auth session
         │
         ▼
Insert into `citizen_stories` with `moderation_status = 'pending'`
         │
         ▼
Story is held in moderation queue (invisible to public due to RLS)
         │
         ▼
Staff/Admin reviews via CMS/Admin Dashboard -> Marks `moderation_status = 'approved'`
         │
         ▼
Public queries now return approved story via GIN-indexed feed
```

---

## 4. Multi-Tenant User Isolation & Row-Level Security

Row-Level Security (RLS) is enforced directly inside the PostgreSQL kernel. Even if client-side code is altered or an attacker uses the raw Supabase REST endpoint:

1. **User Progress Isolation**:
   ```sql
   CREATE POLICY "Users can manage their own progress"
     ON user_lesson_progress FOR ALL
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);
   ```
2. **Public Content Gating**:
   ```sql
   CREATE POLICY "Public read published law articles"
     ON law_articles FOR SELECT
     USING (verification_status = 'published');
   ```
3. **Admin Elevation**:
   Evaluated using `is_admin()` or `is_staff()` functions that verify user roles directly against `profiles.role` without trusting client assertions.

---

## 5. Performance & Caching Strategy

1. **Static Pre-Rendering (SSG)**:
   - High-traffic content pages (all legal situations, fundamental rights articles, landmark case studies) are prerendered at build time.
   - Initial load achieves sub-100ms TTFB via CDN edge caches.
2. **Incremental Cache Invalidation**:
   - Mutations performed via Server Actions invoke targeted Next.js cache revalidation (`revalidatePath`).
   - Only modified learning tracks or user profile views are re-evaluated, leaving static assets cached indefinitely.
3. **Database Indexing**:
   - Trigram (`pg_trgm`) and GIN indexes support instant search across thousands of statutory records with sub-10ms query execution times.
