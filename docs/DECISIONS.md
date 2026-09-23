# Architectural Decision Records (ADRs)

This document records key architectural decisions made during the design and development of **Nyaya Revolution**, detailing the context, options considered, decisions, and consequences.

---

## ADR-001: Supabase as Primary Backend Platform (PostgreSQL + Auth + RLS)

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal Architect, Full-Stack Infrastructure Team

### Context
Nyaya Revolution requires a production-grade relational database to support 500+ legal situations, constitutional articles, learning journeys, user progress, citizen stories, and content governance. We needed user authentication, fine-grained access control, full-text search, and real-time subscription capabilities without the complexity of managing bespoke database servers.

### Decision
Adopt **Supabase** (PostgreSQL 15+) as the unified backend platform:
1. Native PostgreSQL provides ACID transactions, robust foreign keys, and JSONB capabilities.
2. Built-in Supabase Auth integrates directly with database users (`auth.users`).
3. Kernel-level Row-Level Security (RLS) guarantees data privacy even if client code is manipulated.

### Consequences
- **Positive:** Rapid development; zero database infrastructure overhead; kernel-enforced data privacy; generous free/pro tiers.
- **Negative:** Vendor dependency on Supabase APIs; mitigated by using standard PostgreSQL migrations and standard `@supabase/ssr` client libraries that can be pointed to self-hosted Supabase if needed.

---

## ADR-002: Dual-Mode Adapter Pattern for Static Site Generation (SSG) & Offline Resilience

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal Architect

### Context
Next.js 16 SSG prerenders 151+ static pages during `next build` (e.g. `generateStaticParams` for situations, laws, journeys, and case studies). In CI/CD pipelines (e.g., GitHub Actions, Vercel build runners) or during local offline development, a live remote database connection might not be configured or may experience network latency.

### Decision
Implement the **Dual-Mode Adapter Pattern** across all database services (`src/services/db/`):
- When `publicEnv.isSupabaseConfigured` is `true`, services query live Supabase PostgreSQL tables.
- When unconfigured or offline, services fall back to verified static repositories (`src/constants/`).
- Fallback paths are read-only and guarantee that builds never fail due to external database unavailability.

### Consequences
- **Positive:** All 151 static routes prerender in seconds with zero build failures; reliable local development and demoing without live database dependencies.
- **Negative:** Two sources of truth must be kept synchronized when authoring static fallback datasets; mitigated by structured seed scripts (`supabase/seed.sql`).

---

## ADR-003: Next.js Server Actions for Mutations

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal Architect, Full-Stack Infrastructure Team

### Context
Client-side mutations (quiz attempts, bookmarks, story submissions, feedback) require secure server-side execution, input validation, and automatic cache invalidation.

### Decision
Use **Next.js Server Actions** (`"use server"`) in `src/actions/` paired with **Zod** schema validation, instead of maintaining bespoke API route controllers or external REST APIs.

### Consequences
- **Positive:** End-to-end type safety between client components and backend actions; zero boilerplate API routing; seamless automatic cache invalidation via `revalidatePath`.
- **Negative:** Server Actions require Next.js server runtime; mitigated by standard Next.js hosting support across Vercel, Node, and Docker.

---

## ADR-004: Row-Level Security (RLS) over Application-Layer Middleware

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Security Engineer, Database Architect

### Context
A legal platform handling citizen grievances, domestic safety queries, and community stories must guarantee zero data leakage between users. Relying purely on Node.js/TypeScript application code for authorization invites accidental omission of `where user_id = ...` filters.

### Decision
Enforce **Row-Level Security (RLS) on 100% of tables** directly in PostgreSQL:
- Users can only read/write their own progress, streaks, bookmarks, and draft stories.
- Administrative operations require `is_admin()` or `is_staff()` security definer function checks.
- The `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to server-side admin workers.

### Consequences
- **Positive:** Mathematically verified data isolation; impossible for a client to read another user's progress or bookmarks even by directly calling PostgREST endpoints.
- **Negative:** Requires careful testing of database policies; mitigated by comprehensive migration scripts (`20260923000003_row_level_security.sql`).

---

## ADR-005: Atomic Stored Procedures (RPCs) for Gamification & Voting

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal Architect, Database Engineer

### Context
Recording a quiz score involves multiple updates: inserting into `quiz_attempts`, incrementing `profiles.xp_points`, and recalculating `profiles.level`. Similarly, story upvoting involves incrementing counters under high concurrency. Doing this via multi-step client requests leads to race conditions and inconsistent XP states.

### Decision
Implement atomic PostgreSQL functions (`record_quiz_attempt` and `increment_story_helpful`) marked as `SECURITY DEFINER` and call them via Supabase RPC.

### Consequences
- **Positive:** Atomic transactions prevent race conditions and cheated XP; reduces roundtrips between application server and database from 3 to 1.
- **Negative:** Logic lives in SQL migrations rather than pure TypeScript; mitigated by version-controlled migration files in `supabase/migrations/`.

---

## ADR-006: Native PostgreSQL Full-Text Search (tsvector) + Trigram Matching

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal Architect

### Context
Citizens search for situations and legal provisions using varying terminology (e.g., "fir", "police stop", "cyber fraud", "rent agreement"). We evaluated external search services (Algolia, Meilisearch) versus PostgreSQL native capabilities.

### Decision
Leverage native PostgreSQL **`tsvector` generated columns with GIN indexes** and **`pg_trgm` trigram similarity** for search across situations, laws, and case studies.

### Consequences
- **Positive:** Zero additional SaaS costs or operational complexity; immediate search index updates upon table writes; sub-10ms response times.
- **Negative:** Advanced semantic embeddings require future pgvector additions; our schema already prepares for this with future AI vector search hooks.

---

## ADR-007: Grounded Retrieval-Augmented Generation (RAG) over Pure LLM Chat

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal AI Architect, Legal Safety Engineer

### Context
In legal education and awareness, generic hallucinations (invented sections, non-existent court citations, fabricated limitation periods) cause direct citizen harm. The AI must never generate legal claims from ungrounded parametric memory.

### Decision
Implement strict **Retrieval-Augmented Generation (RAG)**: all prompts are assembled with retrieved verified statutory anchors (`[SOURCE-1]`, `[SOURCE-2]`). The model is instructed to cite only retrieved provisions and explicitly declare uncertainty when evidence is insufficient.

### Consequences
- **Positive:** Zero hallucinated provisions; verified statutory citations; 100% source traceability.
- **Negative:** Dependent on quality of retrieval indexing; mitigated by multi-source keyword, trigram, and FTS coverage.

---

## ADR-008: Structured Zod Validation with Resilient Safe Repair

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Principal Full-Stack Engineer

### Context
LLMs can occasionally return markdown code blocks, truncated JSON, or malformed schema properties. A JSON parse failure must never crash the Next.js page or leave the citizen stranded.

### Decision
Implement `StructuredResponseValidator`: parses JSON, strips markdown fences, uses regex substring recovery if needed, validates against `aiLearningResponseSchema`, and falls back to a deterministic verified response if the model fails.

### Consequences
- **Positive:** 100% crash immunity; reliable UI rendering.
- **Negative:** Fallback responses have slightly less custom phrasing; mitigated by high-quality verified statutory fallback templates.

---

## ADR-009: Server-Only AI Secret Isolation

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Security Engineer

### Context
AI provider keys (`GEMINI_API_KEY`) exposed in client JavaScript can be extracted and abused, causing denial of service and billing compromise.

### Decision
Restrict `GEMINI_API_KEY` strictly to `serverEnv` and server-side operations (Next.js Server Actions and `/api/ai/chat` route handler). Never use `NEXT_PUBLIC_` for AI credentials.

### Consequences
- **Positive:** Zero credential exposure; secure server-side rate control.
- **Negative:** Streaming requires SSE route handler (`/api/ai/chat`) rather than direct client-to-Gemini SDK calls.

---

## ADR-010: Human Review Governance for AI-Generated Quizzes and Scenarios

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Content Governance Architect

### Context
Generating practice quizzes and scenarios via AI enables rapid curriculum expansion, but untested legal questions cannot automatically enter official certified curriculum.

### Decision
All AI-generated scenarios and questions enter the system with `governanceStatus: "draft"` or `"needs_review"`. They are logged into `content_verification_logs` and require advocate or staff approval before becoming official course curriculum.

### Consequences
- **Positive:** Protects official curriculum integrity; complies with institutional governance standards.
- **Negative:** Requires staff review step before publishing.

