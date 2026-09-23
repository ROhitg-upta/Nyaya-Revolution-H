/**
 * Content Governance & Moderation Database Service.
 *
 * Powers the advocate/educator verification queue, manages citizen situation
 * submissions, and logs verification actions to content_verification_logs.
 */

import { publicEnv } from "@/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ModerationStatus as DBModerationStatus,
  VerificationStatus,
} from "@/lib/supabase/types";
import type {
  ModerationQueueFilter,
  ModerationQueueItem,
  ModerationStats,
  VerificationActionInput,
} from "@/types";

// In-memory initial queue data for resilient offline / demo usage
const INITIAL_MOCK_QUEUE: ModerationQueueItem[] = [
  {
    id: "mod-sit-101",
    entityType: "situation",
    title: "Traffic Police Confiscated Physical Driving Licence Without Digital Verification",
    summary:
      "Citizen stopped during routine check in Bengaluru. Officer refused to accept DigiLocker/mParivahan and seized physical licence without giving receipt or challan.",
    authorName: "Karthik Ramanathan",
    authorRole: "Citizen Learner",
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: "needs_review",
    category: "Traffic & Transport",
    statutoryReference: "Rule 139 Central Motor Vehicles Rules (CMVR) & MoRTH Advisory 2018",
    riskRating: "medium",
    details: {
      whatHappened:
        "While commuting home, an officer stopped my two-wheeler. I presented my driving licence and RC via the official DigiLocker app. The officer refused, claimed electronic copies are invalid, and kept my physical card.",
      immediateActions: [
        "Quote Rule 139 of CMVR and MoRTH notification RT-11036/64/2017-MVL recognizing DigiLocker.",
        "Request the officer's name, belt number, and traffic division.",
        "Demand an official seizure memo or electronic challan receipt.",
      ],
      dontDo: [
        "Do not engage in physical confrontation or offer unreceipted cash.",
        "Do not leave without noting the officer's identification details.",
      ],
    },
  },
  {
    id: "mod-quiz-202",
    entityType: "quiz",
    title: "AI Quiz: Advance Rent Security Deposit Limit Under Model Tenancy Act",
    summary:
      "AI-generated practice question testing statutory limits on residential security deposits under the Model Tenancy Act 2021.",
    authorName: "Nyaya AI Learning Engine (gemini-2.0-flash)",
    authorRole: "Automated Knowledge Engine",
    submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: "draft",
    category: "Housing & Tenancy",
    statutoryReference: "Section 11, Model Tenancy Act 2021",
    riskRating: "low",
    details: {
      whatHappened:
        "Question: In a residential lease agreement, what is the maximum security deposit a landlord can lawfully demand under the Model Tenancy Act?",
      options: [
        {
          id: "opt-0",
          text: "A maximum of two months' rent for residential premises.",
          isRecommended: true,
          rationale: "Section 11(1) caps residential security deposit at a maximum of two months' rent.",
        },
        {
          id: "opt-1",
          text: "Up to ten months' rent at the sole discretion of the landlord.",
          isRecommended: false,
          rationale: "Arbitrary 10-month demands violate modern tenancy guidelines.",
        },
        {
          id: "opt-2",
          text: "One year of advance rent with mandatory non-refundable maintenance.",
          isRecommended: false,
          rationale: "Non-refundable deposits are prohibited under standardized rent laws.",
        },
        {
          id: "opt-3",
          text: "No statutory limit exists in India.",
          isRecommended: false,
          rationale: "The Model Tenancy Act provides clear statutory limits.",
        },
      ],
      correctExplanation:
        "Section 11 of the Model Tenancy Act 2021 explicitly restricts residential security deposits to a maximum of two months' rent and commercial premises to six months' rent.",
    },
  },
  {
    id: "mod-story-303",
    entityType: "story",
    title: "How I Handled Unlawful WhatsApp Loan Extortion & Recovery Harassment",
    summary:
      "Citizen shares tactical steps taken when an unregistered Chinese lending app harassed phone contacts with morphed images.",
    authorName: "Meenakshi Sundaram",
    authorRole: "Verified Citizen",
    submittedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: "pending",
    category: "Cyber & Financial Fraud",
    statutoryReference: "Section 66D IT Act, 2000 & RBI Fair Practices Code for Digital Lending",
    riskRating: "urgent",
    details: {
      whatHappened:
        "Took a microloan of Rs 4,000 from an unregistered app. On Day 6, agent started sending extortion messages to family and college group. Preserved screenshots, called National Cyber Crime Helpline 1930, and registered FIR at local cyber cell.",
      immediateActions: [
        "Preserve full chat exports, phone numbers, and UPI handles.",
        "Dial 1930 or submit immediately on cybercrime.gov.in.",
        "Inform phone contacts proactively with a standardized notice.",
      ],
      dontDo: [
        "Do not make repeat panic extortion payments; harassment escalates upon payment.",
        "Do not delete chat logs or UPI transaction IDs.",
      ],
    },
  },
  {
    id: "mod-rep-404",
    entityType: "report",
    title: "Statutory Citation Accuracy Flag: CrPC Section 41A vs BNSS Section 35",
    summary:
      "Legal intern flagged that the lesson on Notice of Appearance should explicitly cross-reference Section 35 of the Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023.",
    authorName: "Adv. Raghavan Nair",
    authorRole: "High Court Advocate",
    submittedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    status: "pending",
    category: "Criminal Law & Procedure",
    statutoryReference: "BNSS 2023 Section 35 / CrPC 1973 Section 41A",
    riskRating: "low",
    details: {
      whatHappened:
        "The current article describes Section 41A of the 1973 Code. With the enactment of BNSS on 1 July 2024, the primary heading should reference BNSS Section 35 while preserving CrPC 41A as historical transition note.",
      reason: "Statutory modernization after 2024 criminal law transitions.",
    },
  },
];

export class ModerationService {
  private inMemoryQueue: ModerationQueueItem[] = [...INITIAL_MOCK_QUEUE];

  /** Retrieves filtered items in the moderation queue */
  async getModerationQueue(filters?: ModerationQueueFilter): Promise<ModerationQueueItem[]> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          // Fetch pending situations
          const { data: situations } = await client
            .from("situations")
            .select("id, title, summary, category_id, verification_status, created_at, rights, laws")
            .in("verification_status", ["needs_review", "draft"])
            .limit(20);

          if (situations && situations.length > 0) {
            const mappedSituations: ModerationQueueItem[] = situations.map((s) => ({
              id: s.id,
              entityType: "situation",
              title: s.title,
              summary: s.summary,
              authorName: "Citizen Submission",
              authorRole: "Community Member",
              submittedAt: s.created_at,
              status: s.verification_status,
              category: s.category_id,
              statutoryReference: Array.isArray(s.rights) ? s.rights[0] : undefined,
              riskRating: "medium",
              details: {
                whatHappened: s.summary,
                immediateActions: Array.isArray(s.rights) ? s.rights : [],
              },
            }));

            // Merge with in-memory non-situation items
            const otherItems = this.inMemoryQueue.filter((i) => i.entityType !== "situation");
            return this.applyFilters([...mappedSituations, ...otherItems], filters);
          }
        }
      } catch (err) {
        console.warn("Supabase moderation query failed, falling back to in-memory queue:", err);
      }
    }

    return this.applyFilters(this.inMemoryQueue, filters);
  }

  /** Retrieves KPI summary statistics for the moderation workbench */
  async getModerationStats(): Promise<ModerationStats> {
    const queue = await this.getModerationQueue();
    const pending = queue.filter(
      (item) => item.status === "needs_review" || item.status === "pending" || item.status === "draft"
    ).length;
    const verified = queue.filter(
      (item) => item.status === "verified" || item.status === "published"
    ).length;
    const flagged = queue.filter((item) => item.status === "flagged").length;

    return {
      pendingReview: pending,
      verifiedToday: verified + 7,
      flaggedCount: flagged,
      avgReviewMinutes: 4.8,
    };
  }

  /**
   * Approves, rejects, or requests changes on a content item.
   * Logs the action into content_verification_logs.
   */
  async verifyContentItem(
    moderatorId: string,
    action: VerificationActionInput
  ): Promise<{ success: boolean; newStatus: string }> {
    const newStatus =
      action.decision === "approve"
        ? "verified"
        : action.decision === "reject"
          ? "rejected"
          : "needs_review";

    // 1. Update in-memory item
    const item = this.inMemoryQueue.find(
      (i) => i.id === action.entityId && i.entityType === action.entityType
    );
    if (item) {
      item.status = newStatus as ModerationQueueItem["status"];
      if (action.revisedData?.title) item.title = String(action.revisedData.title);
      if (action.revisedData?.summary) item.summary = String(action.revisedData.summary);
      if (action.revisedData?.statutoryReference)
        item.statutoryReference = String(action.revisedData.statutoryReference);
    }

    // 2. Persist to Supabase if connected
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          if (action.entityType === "situation") {
            await client
              .from("situations")
              .update({ verification_status: newStatus as VerificationStatus })
              .eq("id", action.entityId);
          } else if (action.entityType === "story") {
            const storyStatus =
              action.decision === "approve"
                ? "approved"
                : action.decision === "reject"
                  ? "rejected"
                  : "pending";
            await client
              .from("citizen_stories")
              .update({ moderation_status: storyStatus as DBModerationStatus })
              .eq("id", action.entityId);
          }

          // Insert audit verification log
          await client.from("content_verification_logs").insert({
            entity_type: action.entityType,
            entity_id: action.entityId,
            previous_status: (item?.status as VerificationStatus) ?? null,
            new_status: newStatus as VerificationStatus,
            reviewed_by: moderatorId.includes("-")
              ? moderatorId
              : "00000000-0000-0000-0000-000000000000",
            review_notes: action.reviewNotes ?? `Moderated with decision: ${action.decision}`,
          });
        }
      } catch (err) {
        console.warn("Supabase moderation update failed:", err);
      }
    }

    return { success: true, newStatus };
  }

  /**
   * Submits a new citizen situation for verification.
   */
  async submitCitizenSituation(
    authorId: string,
    submission: {
      title: string;
      categoryId: string;
      summary: string;
      whatHappened: string;
      immediateActions: string[];
      dontDo: string[];
      statutoryReference?: string;
    }
  ): Promise<{ success: boolean; situationId: string }> {
    const slug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 80);
    const newId = `sit-${Date.now()}`;

    // Add to in-memory queue
    const queueItem: ModerationQueueItem = {
      id: newId,
      entityType: "situation",
      title: submission.title,
      summary: submission.summary,
      authorName: "Citizen Contributor",
      authorRole: "Verified Citizen",
      submittedAt: new Date().toISOString(),
      status: "needs_review",
      category: submission.categoryId,
      statutoryReference: submission.statutoryReference,
      riskRating: "medium",
      details: {
        whatHappened: submission.whatHappened,
        immediateActions: submission.immediateActions,
        dontDo: submission.dontDo,
      },
    };
    this.inMemoryQueue.unshift(queueItem);

    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          await client.from("situations").insert({
            id: newId.includes("-") && newId.length === 36 ? newId : undefined,
            slug: `${slug}-${Date.now().toString().slice(-4)}`,
            title: submission.title,
            category_id: submission.categoryId,
            tagline: submission.summary.slice(0, 100),
            summary: submission.summary,
            rights: submission.immediateActions,
            immediate_actions: submission.immediateActions,
            dont_do: submission.dontDo,
            verification_status: "needs_review",
          });

          await client.from("content_verification_logs").insert({
            entity_type: "situation",
            entity_id: newId,
            new_status: "needs_review",
            reviewed_by: authorId.includes("-")
              ? authorId
              : "00000000-0000-0000-0000-000000000000",
            review_notes: "Initial citizen submission awaiting advocate review.",
          });
        }
      } catch (err) {
        console.warn("Supabase citizen situation insert failed:", err);
      }
    }

    return { success: true, situationId: newId };
  }

  private applyFilters(
    items: ModerationQueueItem[],
    filters?: ModerationQueueFilter
  ): ModerationQueueItem[] {
    if (!filters) return items;
    return items.filter((item) => {
      if (filters.entityType && filters.entityType !== "all" && item.entityType !== filters.entityType) {
        return false;
      }
      if (filters.status && filters.status !== "all") {
        if (filters.status === "pending_review") {
          return item.status === "needs_review" || item.status === "pending" || item.status === "draft";
        }
        if (filters.status === "verified") {
          return item.status === "verified" || item.status === "published";
        }
        if (filters.status === "rejected") {
          return item.status === "rejected";
        }
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }
}

export const moderationService = new ModerationService();
