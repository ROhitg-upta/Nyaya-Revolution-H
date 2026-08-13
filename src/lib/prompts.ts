/**
 * Prompt architecture for the AI Learning Companion.
 *
 * Modular prompt builder: system prompt → user context → response mode →
 * conversation history → current question → expected format. Each layer is
 * independently composable for future improvements (RAG context, retrieval
 * augmentation, fine-tuning data generation).
 */
import type { PromptContext, ResponseModeId, UserContext, ChatMessage } from "@/types";

const SYSTEM_PROMPT = `You are Nyaya, an AI legal education tutor built for Indian citizens. Your purpose is to EDUCATE users about their legal rights — not to provide legal advice for specific cases.

Core principles:
1. TEACH, don't just answer. Every interaction should improve the user's legal awareness.
2. Use SITUATION-FIRST learning: start from real-life scenarios, not legal textbooks.
3. Reference specific Indian laws, acts, and sections when applicable.
4. Always include actionable steps the user can take.
5. Flag when professional legal help is recommended.
6. Never claim to replace a lawyer or provide case-specific legal advice.
7. Be empathetic and patient — many users are in stressful situations.

You MUST structure every response using the following sections (skip a section only if it genuinely does not apply):
- Situation Summary
- Your Rights
- Relevant Laws (with act name + section numbers)
- Immediate Action Steps
- Documents Required
- Authorities to Contact
- Common Mistakes to Avoid
- Related Learning Journey
- Practice Quiz (1-2 quick questions)
- Need Professional Help?

Always end with a disclaimer that this is educational guidance, not legal advice.`;

const MODE_INSTRUCTIONS: Record<ResponseModeId, string> = {
  eli15:
    "Explain everything as if the user is 15 years old. Use simple words, everyday analogies, and relatable examples. Avoid all legal jargon — if you must use a legal term, immediately explain it in plain language. Keep sentences short.",
  detailed:
    "Provide a comprehensive, detailed explanation. Include historical context where relevant, explain the reasoning behind the law, discuss edge cases, and provide nuanced analysis. Use proper legal terminology but always explain it.",
  legal:
    "Use formal legal language and terminology. Reference specific acts, sections, and subsections. Include relevant case law citations where applicable. Write as a legal professional would for an educated audience.",
  summary:
    "Be extremely concise. Maximum 3-4 bullet points per section. The entire response should be readable in under 60 seconds. Prioritize the most critical information only.",
  "step-by-step":
    "Format everything as numbered, sequential action steps. Each step should be one clear action. Include who to contact, what to say, what to bring, and expected timelines. Make it a checklist the user can follow immediately.",
};

function buildUserContextBlock(ctx: UserContext): string {
  const parts: string[] = [];
  if (ctx.name) parts.push(`Name: ${ctx.name}`);
  if (ctx.occupation) parts.push(`Occupation: ${ctx.occupation}`);
  if (ctx.ageGroup) parts.push(`Age group: ${ctx.ageGroup}`);
  if (ctx.language) parts.push(`Preferred language: ${ctx.language}`);
  if (ctx.interests?.length) parts.push(`Interests: ${ctx.interests.join(", ")}`);
  if (ctx.learningGoals?.length) parts.push(`Learning goals: ${ctx.learningGoals.join(", ")}`);

  return parts.length > 0
    ? `\n\nUser profile:\n${parts.join("\n")}`
    : "";
}

function buildHistoryBlock(messages: ChatMessage[], maxTurns = 10): string {
  const recent = messages.slice(-maxTurns * 2);
  if (recent.length === 0) return "";

  const lines = recent.map((m) => {
    const role = m.role === "user" ? "User" : "Nyaya";
    const content =
      m.content.length > 500 ? m.content.slice(0, 500) + "…" : m.content;
    return `${role}: ${content}`;
  });

  return `\n\nConversation so far:\n${lines.join("\n")}`;
}

export function buildPrompt(ctx: PromptContext): string {
  const parts = [
    ctx.systemPrompt || SYSTEM_PROMPT,
    `\nResponse mode: ${ctx.responseMode}`,
    MODE_INSTRUCTIONS[ctx.responseMode],
    buildUserContextBlock(ctx.userContext),
    buildHistoryBlock(ctx.conversationHistory),
    ctx.situationSlug
      ? `\nThe user is asking about the situation: ${ctx.situationSlug}`
      : "",
    `\n\nUser's question: ${ctx.currentQuestion}`,
    "\n\nRespond using the structured format described in your instructions.",
  ];

  return parts.filter(Boolean).join("\n");
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function getModeInstruction(mode: ResponseModeId): string {
  return MODE_INSTRUCTIONS[mode];
}

export const RESPONSE_FORMAT_SCHEMA = {
  situationSummary: "string — 2-3 sentence overview of the situation",
  rights: "string[] — list of applicable rights",
  laws: "{ name, section, description }[] — relevant laws with references",
  immediateActions: "string[] — ordered action steps",
  documentsRequired: "string[] — documents the user should gather",
  authorities: "{ name, description, contact? }[] — where to go for help",
  commonMistakes: "string[] — pitfalls to avoid",
  learningJourney: "{ title, slug, lessons } — related learning path",
  quiz: "{ title, questions, slug } — practice quiz reference",
  professionalHelp: "string — when and how to get a lawyer",
} as const;
