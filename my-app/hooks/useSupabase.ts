import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

export const useSupabase = () => {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth();
  const [supabase, setSupabase] = useState(() => createSupabaseClient(null));
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initClient = async () => {
      if (!isLoaded) {
        return;
      }

      setIsInitializing(true);

      try {
        const token = isSignedIn
          ? await getToken({ template: "supabase" })
          : null;

        if (!isMounted) {
          return;
        }

        setSupabase(createSupabaseClient(token));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.warn("Failed to initialize Supabase client with Clerk token", error);
        setSupabase(createSupabaseClient(null));
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    void initClient();

    return () => {
      isMounted = false;
    };
  }, [getToken, isLoaded, isSignedIn, userId]);

  return { supabase, isInitializing };
};
