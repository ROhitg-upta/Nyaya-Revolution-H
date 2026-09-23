/**
 * Community & Citizen Stories Database Service.
 *
 * Manages citizen experience submissions, moderation status, helpful reactions,
 * and user bookmarks.
 */

import { publicEnv } from "@/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CitizenStory } from "@/components/common/citizen-story-card";

const FALLBACK_STORIES: CitizenStory[] = [
  {
    id: "story-deposit-refund-resolved",
    authorName: "Rohan Varma",
    authorRole: "Software Engineer",
    authorInitials: "RV",
    category: "Housing",
    title: "Recovered ₹45,000 security deposit after 4 months of refusal",
    whatHappened:
      "My Bangalore landlord refused to refund my deposit citing unverified painting charges and imaginary kitchen damages.",
    actionTaken:
      "Served a formal legal notice quoting Section 108 of the Transfer of Property Act and Bangalore Rent Control guidelines via registered post.",
    outcome: "Full deposit refunded with ₹2,000 interest within 10 days of notice delivery.",
    resolutionStatus: "resolved",
    statutoryBacking: "Transfer of Property Act, 1882 (Section 108)",
    helpfulCount: 42,
    timeAgo: "2 days ago",
  },
  {
    id: "story-upi-fraud-reversed",
    authorName: "Pooja Hegde",
    authorRole: "College Student",
    authorInitials: "PH",
    category: "Cyber Safety",
    title: "Unauthorized ₹18,000 transaction reversed via 1930 Helpline",
    whatHappened:
      "A fraudster mimicked a courier delivery service and initiated unauthorized UPI debits from my bank account.",
    actionTaken:
      "Called the National Cyber Crime 1930 Helpline within 45 minutes and blocked the account at my bank branch with acknowledgment.",
    outcome: "Transaction frozen at beneficiary bank; full amount credited back in 5 days.",
    resolutionStatus: "resolved",
    statutoryBacking: "RBI Zero Liability Circular for Unauthorized Electronic Transactions",
    helpfulCount: 68,
    timeAgo: "1 week ago",
  },
];

export class CommunityService {
  /** Retrieves approved citizen stories */
  async getStories(category?: string): Promise<CitizenStory[]> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          let query = client
            .from("citizen_stories")
            .select("*")
            .eq("moderation_status", "approved")
            .order("created_at", { ascending: false });

          if (category) {
            query = query.eq("category", category);
          }

          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return data.map((d) => ({
              id: d.id,
              authorName: d.author_name,
              authorRole: d.author_role,
              authorInitials: d.author_initials,
              category: d.category,
              title: d.title,
              whatHappened: d.what_happened,
              actionTaken: d.action_taken,
              outcome: d.legal_outcome,
              resolutionStatus: d.resolution_status,
              statutoryBacking: d.statutory_backing ?? undefined,
              helpfulCount: d.helpful_count,
              timeAgo: "Recently",
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase stories query failed, falling back to static fixtures:", err);
      }
    }

    if (category) {
      return FALLBACK_STORIES.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    return FALLBACK_STORIES;
  }

  /** Increments or decrements the helpful counter for a story */
  async toggleHelpful(storyId: string, helpful: boolean): Promise<number> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          const delta = helpful ? 1 : -1;
          const { data, error } = await client.rpc("increment_story_helpful", {
            story_id: storyId,
            delta,
          });

          if (!error && typeof data === "number") {
            return data;
          }
        }
      } catch (err) {
        console.warn("Supabase toggle helpful failed:", err);
      }
    }

    return helpful ? 1 : 0;
  }
}

export const communityService = new CommunityService();
