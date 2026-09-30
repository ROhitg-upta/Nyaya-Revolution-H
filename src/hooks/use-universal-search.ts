"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { unifiedSearch } from "@/lib/search";
import type {
  SearchEntityType,
  SearchIntent,
  SearchResultItem,
  UnifiedSearchResults,
} from "@/types";

interface UseUniversalSearchOptions {
  initialQuery?: string;
  initialFilter?: SearchEntityType | "all";
  debounceMs?: number;
  limit?: number;
}

export interface UseUniversalSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  entityFilter: SearchEntityType | "all";
  setEntityFilter: (filter: SearchEntityType | "all") => void;
  isLoading: boolean;
  results: UnifiedSearchResults;
  items: SearchResultItem[];
  intent: SearchIntent;
  total: number;
  clear: () => void;
  executeSearch: (immediateQuery?: string) => void;
}

const EMPTY_RESULTS: UnifiedSearchResults = {
  query: "",
  normalizedQuery: "",
  intent: "mixed",
  total: 0,
  items: [],
  byType: {
    situation: [],
    law: [],
    article: [],
    lesson: [],
    journey: [],
    case_study: [],
    glossary: [],
    story: [],
    resource: [],
  },
};

export function useUniversalSearch({
  initialQuery = "",
  initialFilter = "all",
  debounceMs = 250,
  limit,
}: UseUniversalSearchOptions = {}): UseUniversalSearchReturn {
  const [query, setQuery] = useState(initialQuery);
  const [entityFilter, setEntityFilter] = useState<SearchEntityType | "all">(
    initialFilter
  );
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<UnifiedSearchResults>(() => {
    if (initialQuery.trim()) {
      return unifiedSearch(initialQuery, initialFilter, { limit });
    }
    return EMPTY_RESULTS;
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(
    (q: string, filter: SearchEntityType | "all") => {
      if (!q.trim()) {
        setResults(EMPTY_RESULTS);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Abort prior pending operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const res = unifiedSearch(q, filter, { limit });
        setResults(res);
      } catch (err) {
        console.error("Universal search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch(query, entityFilter);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, entityFilter, debounceMs, runSearch]);

  const clear = useCallback(() => {
    setQuery("");
    setResults(EMPTY_RESULTS);
    setIsLoading(false);
  }, []);

  const executeSearch = useCallback(
    (immediateQuery?: string) => {
      const q = immediateQuery !== undefined ? immediateQuery : query;
      runSearch(q, entityFilter);
    },
    [query, entityFilter, runSearch]
  );

  return {
    query,
    setQuery,
    entityFilter,
    setEntityFilter,
    isLoading,
    results,
    items: results.items,
    intent: results.intent,
    total: results.total,
    clear,
    executeSearch,
  };
}
