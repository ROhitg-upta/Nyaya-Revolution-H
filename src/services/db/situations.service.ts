/**
 * Situations Database Service.
 *
 * Provides query capabilities for citizen legal situations, category filtering,
 * full-text search, and relational associations.
 */

import { publicEnv } from "@/config";
import { situationCategories, situations } from "@/constants/situations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ApplicableLaw,
  Authority,
  EmergencyContact,
  Situation,
  SituationCategory,
  SituationCategoryId,
} from "@/types";

export class SituationsService {
  /** Retrieves all situation categories */
  async getCategories(): Promise<SituationCategory[]> {
    return situationCategories;
  }

  /** Retrieves all published situations, optionally filtered by category */
  async getSituations(category?: SituationCategoryId): Promise<Situation[]> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          let query = client
            .from("situations")
            .select("*")
            .eq("verification_status", "published");

          if (category) {
            query = query.eq("category_id", category);
          }

          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return data.map((d) => {
              const matchedCategory = situationCategories.find(
                (c) => c.id === d.category_id,
              );
              return {
                slug: d.slug,
                title: d.title,
                category: d.category_id as SituationCategoryId,
                subcategory: d.subcategory ?? undefined,
                icon: matchedCategory?.icon ?? situationCategories[0].icon,
                tagline: d.tagline,
                summary: d.summary,
                rights: d.rights,
                laws: Array.isArray(d.laws) ? (d.laws as unknown as ApplicableLaw[]) : [],
                immediateActions: d.immediate_actions,
                dontDo: d.dont_do,
                documents: d.documents,
                authorities: Array.isArray(d.authorities)
                  ? (d.authorities as unknown as Authority[])
                  : [],
                emergency: Array.isArray(d.emergency_contacts)
                  ? (d.emergency_contacts as unknown as EmergencyContact[])
                  : [],
                learningPath: {
                  title: "Relevant Rights Track",
                  lessons: 3,
                  duration: "15 min",
                },
                quiz: {
                  title: "Test Your Rights",
                  questions: 5,
                  minutes: 5,
                },
                verificationStatus: d.verification_status,
                lastVerifiedAt: d.updated_at,
                version: 1,
              };
            });
          }
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to static fixtures:", err);
      }
    }

    if (category) {
      return situations.filter((s) => s.category === category);
    }
    return situations;
  }

  /** Retrieves a situation by its slug */
  async getSituationBySlug(slug: string): Promise<Situation | null> {
    const all = await this.getSituations();
    return all.find((s) => s.slug === slug) ?? null;
  }

  /** Searches situations using full-text keyword matching */
  async search(query: string): Promise<Situation[]> {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return [];

    const all = await this.getSituations();
    return all.filter(
      (s) =>
        s.title.toLowerCase().includes(normalized) ||
        s.tagline.toLowerCase().includes(normalized) ||
        s.summary.toLowerCase().includes(normalized) ||
        s.rights.some((r) => r.toLowerCase().includes(normalized)),
    );
  }
}

export const situationsService = new SituationsService();
