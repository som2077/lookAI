import { useCallback, useEffect, useState } from "react";
import type { PostgrestError, PostgrestFilterBuilder } from "@supabase/supabase-js";
import { useSupabase } from "@/hooks/useSupabase";

type UseSupabaseQueryOptions = {
  select?: string;
  apply?: (
    query: PostgrestFilterBuilder<any, any, any>,
  ) => PostgrestFilterBuilder<any, any, any>;
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

  const fetchData = useCallback(async () => {
    if (options?.enabled === false || isInitializing) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(options?.select ?? "*");

      if (options?.apply) {
        query = options.apply(query);
      }

      const { data: rows, error: queryError } = await query;

      if (queryError) {
        setError(queryError);
        setData([]);
        return;
      }

      setData((rows ?? []) as T[]);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError
          : new Error("Failed to fetch Supabase data."),
      );
    } finally {
      setLoading(false);
    }
  }, [isInitializing, options?.apply, options?.enabled, options?.select, supabase, table]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
