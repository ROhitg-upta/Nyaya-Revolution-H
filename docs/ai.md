# Nyaya Revolution — Production AI Learning Engine & Verified Retrieval

**Specification Version:** 1.0.0  
**Engine:** Grounded Retrieval-Augmented Generation (RAG) + Google Gemini 2.0 Flash  
**Safety Status:** High Assurance — Zero-Hallucination Policy  
**Jurisdiction:** Republic of India (Constitution of India, Central Acts, Supreme Court & High Court Precedents)  

---

## 1. System Philosophy & Product Mission

Nyaya Revolution's AI is **not a generic chatbot** or an unconstrained answer generator. It is a **grounded educational learning companion** built to guide Indian citizens along the product journey:

$$\text{What happened?} \longrightarrow \text{Understand} \longrightarrow \text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Act} \longrightarrow \text{Reflect}$$

### Core Non-Negotiable Tenets:
1. **Verified Knowledge First**: All legal facts, rights, sections, case citations, penalties, and official remedies are extracted from Nyaya Revolution's verified statutory database. The model is forbidden from answering knowledge-dependent legal questions from parametric memory alone.
2. **Strict Separation of Content Tiers**:
   - **Tier 1 (Authoritative)**: Constitution of India, Central/State Acts, Supreme Court judgments, Government Gazettes.
   - **Tier 2 (Platform Verified)**: Nyaya Revolution curated Situations, Learning Modules, and Glossary Terms.
   - **Tier 3 (AI Educational Explanations)**: Grounded ELI15 breakdowns, analogies, and practice checks.
   - **Tier 4 (Community Voices)**: Citizen lived experiences and moderation-gated resolutions.
3. **No Fabricated Legal Advice**: The system never predicts court outcomes, does not guarantee case wins, and does not claim to act as an advocate representing the citizen. Sensitive situations (custodial violence, domestic abuse, sexual harassment, financial extortion) trigger official emergency helplines (112, 1930, 1091) and advocate referrals.

---

## 2. End-to-End Architectural Pipeline

```
                                  [ Citizen User Inquiry ]
                                (English, Hindi, or Hinglish)
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │    Input Sanitizer & Guard    │
                             │ (Min 2 chars, max 1500 chars) │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │       Query Normalizer        │
                             │  - Multilingual Tokenization  │
                             │  - Canonical Legal Area Match │
                             │  - Sensitivity / Emergency Tag│
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │   Verified Retrieval Engine   │
                             │  (src/services/ai/retrieval)  │
                             │  - Law Articles & Sections    │
                             │  - 500+ Legal Situations      │
                             │  - Landmark Judgments (SCC)   │
                             │  - Statutory Acts & Glossary  │
                             │  - Gated to Published Only    │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │        Context Builder        │
                             │  - Token Budget (~3k tokens)  │
                             │  - [SOURCE-N] Citation Anchors│
                             │  - Active Lesson / State      │
                             │  - User Learning Context (XP) │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │   Server-Side Orchestration   │
                             │  (GEMINI_API_KEY server-only) │
                             │  - Grounding Directives       │
                             │  - Strict JSON Mode           │
                             │  - 18s Timeout + Exponential  │
                             │    Backoff Retry Logic        │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │  Structured Output Validator  │
                             │  - Zod Schema Validation      │
                             │  - Markdown Fence Stripping   │
                             │  - Regex Substring Recovery   │
                             │  - Safe Grounded Fallback     │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │    Session & Action Store     │
                             │  - Supabase RLS (ai_messages) │
                             │  - Traceable Source Metadata  │
                             │  - Learning Recommendations   │
                             └───────────────────────────────┘
```

---

## 3. Grounding & Anti-Hallucination Framework

The prompt architecture (`src/services/ai/prompts.ts`) strictly binds model output to numbered source anchors:
- `[SOURCE-1]`: Article 21, Constitution of India (Protection of Life & Liberty)
- `[SOURCE-2]`: Model Tenancy Act, 2021 (Section 13: 30-Day Security Deposit Refund)
- `[SOURCE-3]`: Consumer Protection Act, 2019 (Deficiency in Service & Replacement)

If the retrieved context lacks a clear statutory provision for an idiosyncratic scenario, the system is instructed to:
1. Explain the closest general procedural guarantee under Indian law.
2. Acknowledge the absence of a specific central provision.
3. Suggest the appropriate authority, civil forum, or RTI channel to verify local state rules.

---

## 4. Multilingual & Hinglish Normalization

Indian citizens frequently express legal grievances in mixed colloquial phrasing. The `QueryNormalizer` (`src/services/ai/query-normalizer.ts`) translates colloquial expressions into canonical statutory domains:

| Citizen Input Example | Identified Domain | Normalized Concepts & Statutory Anchors |
|---|---|---|
| *"Mera landlord deposit wapas nahi de raha, bolta hai painting ke paise katunga"* | `housing` | Model Tenancy Act Sec 13; Security Deposit Refund; Prohibition of Arbitrary Deductions |
| *"Police ne raste pe roka bina warrant phone check kiya"* | `criminal` / `constitutional` | Article 21 Privacy; D.K. Basu Arrest Guidelines; Section 50 CrPC Right to Grounds |
| *"Amazon se defective mobile aya refund nahi de rahe"* | `consumer` | Consumer Protection Act 2019; Deficiency in Service; National Consumer Helpline 1915 |
| *"Traffic police ne bike ki chabi nikal li"* | `traffic` | Motor Vehicles Amendment Act 2019; Rule 139 CMVR; DigiLocker Acceptance |
| *"College original marksheet rok ke baitha hai"* | `education` | UGC Prohibition on Retention of Original Certificates Regulations |

---

## 5. First-Class AI Capabilities

1. **Situation Understanding**: Analyzes the citizen's grievance, identifies rights, generates an immediate action plan, warns against common mistakes, and creates a practice question.
2. **Concept Explainer (`explainConceptAction`)**: Translates complex doctrines (*audi alteram partem*, *res judicata*, *promissory estoppel*, *quashing of FIR*) into citizen language.
3. **Lesson Simplifier (`simplifyLessonAction`)**: Breaks dense curriculum modules into 3-4 bullet takeaways, highlighting citizen myths versus statutory reality.
4. **Learning Recommendation Engine (`getRecommendationsAction`)**: Combines completed lessons, quiz errors, and active situation interest to prescribe the next educational milestone.
5. **Practice Scenario Generator (`generatePracticeScenarioAction`)**: Generates interactive multiple-choice scenarios. All generated questions enter with status `draft` in governance audit logs.
6. **Streaming Chat Assistant (`/api/ai/chat`)**: Server-Sent Events (SSE) route delivering instant token streaming to the AI chat interface with fallback resilience.

---

## 6. Privacy & Security Guardrails

- **Zero Client Key Exposure**: `GEMINI_API_KEY` is isolated in `serverEnv.geminiApiKey` and never bundled into client JS or exported across bundle boundaries.
- **Kernel-Level User Isolation**: AI conversations and messages are persisted in Supabase tables `ai_conversations` and `ai_messages` under Row-Level Security (`user_id = auth.uid()`).
- **PII Scrubbing**: Query titles automatically mask 12-digit Aadhaar patterns and 10-digit phone numbers before database persistence.
- **Dual-Mode Graceful Fallback**: In offline, CI/CD, or unauthenticated environments where Gemini credentials are not present, the system automatically fulfills all queries using verified static platform knowledge without crashing or throwing 500 errors.
