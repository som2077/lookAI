import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Gender = "Male" | "Female" | "";

type OnboardingState = {
  age: number;
  height: number;
  gender: Gender;
  bodyType: string;
  nickname: string;
  stylePreferences: string[];
  isSaving: boolean;
  error: string | null;
  _completionVersion: number;
  setAge: (value: number) => void;
  setHeight: (value: number) => void;
  setGender: (value: Gender) => void;
  setBodyType: (value: string) => void;
  setNickname: (value: string) => void;
  toggleStyle: (value: string) => void;
  completeOnboarding: (
    userId: string,
    supabase: SupabaseClient,
  ) => Promise<boolean>;
};

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) =>
    SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const useOnboardingState = create<OnboardingState>()(
  persist(
    (set, get) => ({
      age: 28,
      height: 165,
      gender: "",
      bodyType: "",
      nickname: "",
      stylePreferences: [],
      isSaving: false,
      error: null,
      _completionVersion: 0,
      setAge: (age) => set({ age }),
      setHeight: (height) => set({ height }),
      setGender: (gender) => set({ gender }),
      setBodyType: (bodyType) => set({ bodyType }),
      setNickname: (nickname) => set({ nickname }),
      toggleStyle: (style) =>
        set((state) => {
          if (state.stylePreferences.includes(style)) {
            return {
              stylePreferences: state.stylePreferences.filter(
                (s) => s !== style,
              ),
            };
          }
          if (state.stylePreferences.length >= 5) return state;
          return { stylePreferences: [...state.stylePreferences, style] };
        }),
      completeOnboarding: async (userId: string, supabase: SupabaseClient) => {
        set({ isSaving: true, error: null });
        try {
          const state = get();

          const { error } = await supabase.from("user_profiles").upsert(
            {
              user_id: userId,
              age: state.age,
              height: state.height,
              gender: state.gender,
              body_type: state.bodyType,
              nickname: state.nickname,
              style_preferences: state.stylePreferences,
            },
            { onConflict: "user_id" },
          );

          if (error) throw error;

          await SecureStore.setItemAsync(
            `onboarding_complete_${userId}`,
            "true",
          );
          set({
            isSaving: false,
            _completionVersion: get()._completionVersion + 1,
          });
          return true;
        } catch (e) {
          console.error("Onboarding completion failed:", e);
          set({ isSaving: false, error: "Failed to save onboarding data" });
          return false;
        }
      },
    }),
    {
      name: "onboarding-state",
      storage: createJSONStorage(() => secureStorage),
      partialize: ({ isSaving, error, _completionVersion, ...state }) => state,
    },
  ),
);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => children;
