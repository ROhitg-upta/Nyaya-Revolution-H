/**
 * Universal Search domain types for Nyaya Revolution.
 *
 * Supports cross-entity queries across Situations, Laws, Articles, Lessons,
 * Journeys, Case Studies, Glossary terms, Citizen Stories, and Verified Resources.
 */

export type SearchEntityType =
  | "situation"
  | "law"
  | "article"
  | "lesson"
  | "journey"
  | "case_study"
  | "glossary"
  | "story"
  | "resource";

export type SearchIntent =
  | "situation"
  | "learning"
  | "legal_knowledge"
  | "community"
  | "glossary"
  | "case_study"
  | "resource"
  | "mixed";

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
  priority?: number;
  metadata?: Record<string, unknown>;
}

export type UniversalSearchResultItem = SearchResultItem;

export interface UnifiedSearchResults {
  query: string;
  normalizedQuery: string;
  intent: SearchIntent;
  total: number;
  items: SearchResultItem[];
  byType: Record<SearchEntityType, SearchResultItem[]>;
}

export interface UniversalSearchOptions {
  query: string;
  filterType?: SearchEntityType | "all";
  limit?: number;
  includeSynonyms?: boolean;
}
