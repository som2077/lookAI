import { useCallback, useEffect, useRef, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { useSupabase } from "./useSupabase";
import { useErrorStore } from "../../components/ui/ErrorStateView";

type QueryBuilder = ReturnType<
  ReturnType<
    ReturnType<typeof import("@supabase/supabase-js").createClient>["from"]
  >["select"]
>;

type UseSupabaseQueryOptions = {
  select?: string;
  apply?: (query: QueryBuilder) => QueryBuilder;
  enabled?: boolean;
};

// ── Simple in-memory cache with 30s TTL to avoid duplicate API calls ──────────
const CACHE_TTL_MS = 30_000;
interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}
const queryCache = new Map<string, CacheEntry<Record<string, unknown>>>();

function getCacheKey(table: string, select?: string): string {
  return `${table}::${select ?? "*"}`;
}

export const useSupabaseQuery = <T extends Record<string, unknown>>(
  table: string,
  options?: UseSupabaseQueryOptions,
) => {
  const { supabase, isInitializing } = useSupabase();
  const cacheKey = getCacheKey(table, options?.select);

  // Initialise from cache immediately to avoid flash of empty state
  const [data, setData] = useState<T[]>(() => {
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T[];
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    const opts = optionsRef.current;

    if (opts?.enabled === false || isInitializing) {
      return;
    }

    // Serve from cache if still fresh
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setData(cached.data as T[]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(opts?.select ?? "*");

      if (opts?.apply) {
        query = opts.apply(query);
      }

      const { data: rows, error: queryError } = await query;

      if (queryError) {
        setError(queryError);
        setData([]);
        return;
      }

      const freshData = (rows ?? []) as unknown as T[];
      // Write to cache
      queryCache.set(cacheKey, { data: freshData as Record<string, unknown>[], timestamp: Date.now() });
      setData(freshData);
    } catch (unknownError) {
      const err =
        unknownError instanceof Error
          ? unknownError
          : new Error("Failed to fetch Supabase data.");
      setError(err);

      // Trigger global offline or server down flags on fetch failure
      if (err.message.includes("Network request failed") || err.message.includes("fetch")) {
        useErrorStore.getState().setOffline(true);
      } else {
        useErrorStore.getState().setServerError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [isInitializing, supabase, table, cacheKey]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
