/**
 * Unified Search domain types.
 *
 * Supports cross-entity queries across Situations, Laws, Articles, Lessons,
 * Journeys, Case Studies, and Glossary terms.
 */
export type SearchEntityType =
  | "situation"
  | "law"
  | "article"
  | "lesson"
  | "journey"
  | "case_study"
  | "glossary"
  | "story";

export interface SearchResultItem {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  summary: string;
  href: string;
  category?: string;
  tags?: string[];
  verificationStatus?: string;
}

export interface UnifiedSearchResults {
  query: string;
  total: number;
  items: SearchResultItem[];
  byType: Record<SearchEntityType, SearchResultItem[]>;
}
