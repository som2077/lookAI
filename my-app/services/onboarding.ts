import { getSupabaseWithAuth } from "@/lib/supabase";

export type SaveOnboardingPayload = {
  userId: string;
  age: number;
  height: number;
  gender: string;
  bodyType: string;
  skinTone: string;
  stylePreferences: string[];
};

export async function upsertOnboardingProfile(payload: SaveOnboardingPayload, clerkJwt: string) {
  const supabase = getSupabaseWithAuth(clerkJwt);

  const { error } = await supabase.from("onboarding_profiles").upsert(
    {
      user_id: payload.userId,
      age: payload.age,
      height: payload.height,
      gender: payload.gender,
      body_type: payload.bodyType,
      skin_tone: payload.skinTone,
      style_preferences: payload.stylePreferences,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(error.message);
}
