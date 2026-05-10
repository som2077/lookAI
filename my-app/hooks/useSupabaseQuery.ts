import { useCallback, useEffect, useRef, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { useSupabase } from "@/hooks/useSupabase";

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

export const useSupabaseQuery = <T extends Record<string, unknown>>(
  table: string,
  options?: UseSupabaseQueryOptions,
) => {
  const { supabase, isInitializing } = useSupabase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    const opts = optionsRef.current;

    if (opts?.enabled === false || isInitializing) {
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

      setData((rows ?? []) as unknown as T[]);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError
          : new Error("Failed to fetch Supabase data."),
      );
    } finally {
      setLoading(false);
    }
  }, [isInitializing, supabase, table]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
