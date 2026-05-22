import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL environment variable.");
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable.",
  );
}

export const createSupabaseClient = (
  clerkToken?: string | null,
): SupabaseClient => {
  const authHeaders: Record<string, string> = clerkToken
    ? { Authorization: `Bearer ${clerkToken}` }
    : {};

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      storage: AsyncStorage,
      detectSessionInUrl: false,
    },
    global: {
      headers: authHeaders,
    },
  });
};
