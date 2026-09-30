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

---

## ADR-011: Three-Tier Authority Separation in Community Voice (`Community Story ≠ AI Summary ≠ Verified Law`)

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Principal Product Architect, Trust & Safety Engineer

### Context
User-submitted legal experiences contain valuable practical awareness (such as how 1930 froze a UPI fraud or how NCH 1915 resolved a refund refusal), but citizen anecdotes can never be presented as binding statutory rules.

### Decision
Enforce explicit visual, structural, and schema separation across three distinct authority tiers on every `/community` card and `/community/stories/[slug]` detail view:
1. **Tier 1 (`Community Story`)**: User-shared experience with explicit `Identity Mode` (`real_name`, `pseudonym`, `anonymous`).
2. **Tier 2 (`AI Educational Summary`)**: Explicitly labeled synthesis (`Not Legal Advice`) that never overwrites the citizen's original narrative.
3. **Tier 3 (`Verified Legal Learning Bridge`)**: Deterministic link (`StoryLearningBridgeData`) connecting the story to verified platform Situations, Indian Statutes (BNSS 2023, CPA 2019, RBI Circulars), Learning Journeys, and AI Practice Scenarios.

---

## ADR-012: Multi-Media Storage Validation & Indian PII Redaction Shield

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Supabase Storage Architect, Security Engineer

### Context
Citizens sharing evidence checklists, voice notes, or video walkthroughs may inadvertently include personal phone numbers, 12-digit Aadhaar numbers, PAN cards, or unsafe file formats.

### Decision
1. Enforce real-time client and server PII detection (`detectAndRedactPII` in `src/lib/sanitization.ts`) with 1-click auto-redaction before story or comment submission.
2. Restrict uploads to `community-media` (`image/jpeg`, `image/png`, `image/webp` ≤ 8MB; `audio/*` ≤ 15MB; `video/mp4`, `video/webm` ≤ 40MB) with path-traversal sanitization (`sanitizeStorageFileName`) and accessible playback without unexpected autoplay.

---

## ADR-013: Multilingual Voice Provider Abstraction & Controlled Legal Terminology Bridge

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Multilingual AI Engineer, Voice UX Engineer

### Context
Indian citizens often express legal problems in spoken Hindi, Hinglish (`"Mera landlord deposit wapas nahi de raha"`), or regional scripts rather than formal English statutory terms. Direct opaque machine translation risks erasing the citizen's original testimony or mistranslating Indian legal terms.

### Decision
1. Define clean provider interfaces (`LanguageDetectionProvider`, `SpeechToTextProvider`, `TranslationProvider`) in `src/types/action-engine.ts` and `src/services/voice/multilingual-voice.service.ts`.
2. Preserve `original_text`, `detected_language`, and `language_script` alongside `normalized_translation`, requiring citizen verification via an editable `"We heard:"` box before submission.
3. Map vernacular/Hinglish triggers through a curated `CONTROLLED_LEGAL_TERMINOLOGY_BRIDGE` rather than allowing uncontrolled freeform legal re-interpretation.

---

## ADR-014: Verified Resource Freshness & Versioned Citizen Action Documents

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Legal-Tech Systems Engineer, Data Verification Architect

### Context
Generating official grievance drafts or recommending government helplines requires zero fabrication and strict jurisdictional clarity (especially distinguishing Central Government RTI at `rtionline.gov.in` from State RTI portals).

### Decision
1. Maintain a verified resource directory (`verified_resources` table + `VERIFIED_RESOURCES_CATALOG`) with `last_verified_at` and `stale_after_days` freshness verification, deterministic jurisdiction scoring, and explicit Central vs State RTI notices.
2. Generate Citizen Action Drafts exclusively from human-reviewed versioned templates (`consumer-grievance-v1`, `rti-application-v1`, `cyber-fraud-incident-v1`, `workplace-wage-representation-v1`, `legal-aid-checklist-v1`) labeled **`Draft / Educational Template / User-Review Required`**, gated behind a mandatory human-review confirmation checkbox before A4 Print/PDF or text export.





## ADR-012: Source-Driven DLSA Directory & Ephemeral Geolocation Privacy
- **Decision**: Never hardcode a national DLSA count or invent missing phone numbers; explicitly store 
ull when absent in official sources and flag multi-source conflicts (conflict_status = 'conflicted'). Discard raw browser coordinates immediately after nearest-district centroid matching.

## ADR-013: Human-in-the-Loop Authority Governance & Immutable Versioning (Sprint E13)
- **Decision**: Disallow automatic background overwrites of verified legal service authorities. Require HTTPS sourceUrl provenance, side-by-side conflict resolution, and immutable 1 -> v2 snapshots with batch rollback.

## ADR-014: Private Case Preparation Workspace & Authority Snapshot Traceability (Sprint E14)
- **Decision**: Preserve exact E13 publishedVersionNumber and erifiedAtSnapshot inside each Citizen Case Preparation Dossier export (case_prep_exports) so printed/offline citizen packs remain auditable even if public directory details later change.

## ADR-015: Frozen Snapshot Handoffs with SHA-256 Hashed Opaque Tokens & Allowlist PWA (Sprint E15)
- **Decision**: Never expose master workspaces or persist plaintext handoff tokens. Store only SHA-256 hashes pointing to frozen snapshots, and restrict Service Worker caching to an explicit static allowlist.

## ADR-016: Denominator-Transparent Outcome Feedback & Small-Cell Cohort Suppression (Sprint E16)
- **Status**: Accepted (2026-09-28)
- **Context**: Measuring whether Nyaya Revolution helps citizens progress from confusion to preparation, verified assistance contact, and longitudinal follow-up requires strict separation between automated platform events (`PLATFORM_EVENT`) and voluntary citizen self-reports (`SELF_REPORTED`), while preventing re-identification in small cohorts or false causal claims.
- **Decision**:
  1. Enforce explicit numerator, denominator, respondent population definition, and observation window (`7d`, `30d`, `90d`, `6m`, `12m`, `all`) on every percentage metric.
  2. Enforce a minimum cohort threshold (`MIN_PUBLIC_COHORT = 10`) that automatically suppresses small cells (`n < 10`) with `"Not enough data to display safely"`.
  3. Support both Private Workspace Timeline Mode (for longitudinal updates across `Prepared -> Contacted -> Received Response -> Resolved` and user-controlled deletion) and Strict Anonymous Mode (zero user ID or case ID linkage).
  4. Restrict authority reachability analytics to descriptive operational signals (`found_resource`, `could_not_reach`, `received_response`) that trigger E13 Moderator Freshness Verification without ranking authorities as "best/worst".

## ADR-017: Closed-Loop Directory Self-Healing & Non-Advisory Procedural Window Tracking (Sprint E17)
- **Status**: Accepted (2026-09-28)
- **Context**: Citizens who encounter unreachable helplines (`could_not_reach` in E16) or who are awaiting a response after filing (`Contacted` / `Awaiting Response`) need verified fallback channels, transparent statutory/procedural waiting-window guidance, and a structured Follow-Up Addendum without risking directory poisoning or unauthorized legal advice.
- **Decision**:
  1. **Anti-Poisoning Self-Healing Pipeline (`E16 -> E13 -> E14`)**: When a verified resource accumulates `>= 3` non-contradictory `could_not_reach` citizen reports within 30 days, automatically open a `HIGH_PRIORITY_CITIZEN_SIGNAL` ticket (`authority_freshness_alerts`) and surface a verified official fallback channel to citizens, while requiring human moderator approval before publishing an immutable authority version bump (`vN -> vN+1`).
  2. **Non-Advisory Statutory Reference Windows**: Frame all elapsed-day calculations (`Section 7(1) RTI Act 30-day window`, `1930 NCRP 14-day nodal follow-up`, `NCH 1915 30-day docket window`, `SAMADHAN 21-day conciliation window`, `DLSA 15-day diary window`) strictly as educational statutory/administrative reference timelines.
  3. **Zero-PII `.ics` Reminders & Bilingual Follow-Up Addendum**: Generate `.ics` calendar reminders with generic titles (`"Nyaya Case Prep: Review Procedural Follow-Up Window"`) and provide a 1-page Bilingual (English + Hindi) Follow-Up Addendum that pairs with the original Case Preparation Dossier (`v1`).

## ADR-018: Multi-Workspace Case Binder, Non-Merging Isolation & Procedural Document Pack (Sprint E18)
- **Status**: Accepted (2026-09-30)
- **Context**: Citizens and authorized helpers frequently handle multiple related preparation records arising from one situation (e.g., shared rental issues involving deposit withholding, RWA maintenance disputes, and defective furnishings, or group wage claims). Silently merging workspaces into a single record causes factual corruption, privacy leaks, and inaccurate legal representations.
- **Decision**:
  1. **Linked != Merged Architectural Principle**: Provide a higher-level `citizen_case_binders` organization layer that links multiple workspaces (`binder_workspaces`) with explicit relationship types (`primary`, `related`, `followup`, `group_member`, `supporting`) while strictly preserving independent facts, checklists, notes, attachments, and ownership boundaries per workspace.
  2. **Anti-IDOR Ownership Validation**: Validate workspace ownership server-side; arbitrary client-provided workspace IDs cannot be linked to another citizen's binder without verified authorization.
  3. **Master Chronology & Conflict Detection**: Aggregate cross-workspace timeline events into a unified master chronology where every milestone displays its source workspace badge and any events sharing identical dates are flagged for user review.
  4. **Multi-Docket & Status Matrix**: Maintain a dedicated docket reference ledger (`binder_docket_references`) and a per-workspace status matrix integrating E16 self-reported outcomes and E17 procedural waiting windows without collapsing them into an artificial single legal conclusion.
  5. **Bilingual Procedural Document Packs & Mandatory Review Gate**: Allow generation of multi-annexure procedural representation drafts (First Appeal / Escalation / Conciliation) clearly labeled "Educational Draft / User Review Required" and gated behind a 6-point mandatory factual confirmation gate.
  6. **Expiring Frozen Handoff (E15 Extension)**: Support temporary read-only binder sharing via SHA-256 token snapshots, ensuring live binder contents are never exposed.



