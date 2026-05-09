import { supabase } from "@/lib/supabase";

type SavePayload = {
  userId: string;
  age: number;
  gender: string;
  bodyType: string;
  skinTone: string;
  stylePreferences: string[];
};

export async function saveOnboardingProfile(payload: SavePayload) {
  const { error } = await supabase.from("onboarding_profiles").upsert(
    {
      user_id: payload.userId,
      age: payload.age,
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
