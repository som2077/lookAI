import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { saveOnboardingProfile } from "@/db/queries";

export type Gender = "Male" | "Female" | "Other" | "";

type OnboardingState = {
  age: number;
  height: number;
  gender: Gender;
  bodyType: string;
  skinTone: string;
  stylePreferences: string[];
  isSaving: boolean;
  error: string | null;
  setAge: (value: number) => void;
  setHeight: (value: number) => void;
  setGender: (value: Gender) => void;
  setBodyType: (value: string) => void;
  setSkinTone: (value: string) => void;
  toggleStyle: (value: string) => void;
  saveToSupabase: (userId: string) => Promise<boolean>;
};

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const useOnboardingState = create<OnboardingState>()(
  persist(
    (set, get) => ({
      age: 28,
      height: 165,
      gender: "",
      bodyType: "",
      skinTone: "",
      stylePreferences: [],
      isSaving: false,
      error: null,
      setAge: (age) => set({ age }),
      setHeight: (height) => set({ height }),
      setGender: (gender) => set({ gender }),
      setBodyType: (bodyType) => set({ bodyType }),
      setSkinTone: (skinTone) => set({ skinTone }),
      toggleStyle: (style) =>
        set((state) => {
          if (state.stylePreferences.includes(style)) {
            return { stylePreferences: state.stylePreferences.filter((s) => s !== style) };
          }
          if (state.stylePreferences.length >= 3) return state;
          return { stylePreferences: [...state.stylePreferences, style] };
        }),
      saveToSupabase: async (userId) => {
        set({ isSaving: true, error: null });
        try {
          const s = get();
          await saveOnboardingProfile({
            userId,
            age: s.age,
            gender: s.gender,
            bodyType: s.bodyType,
            skinTone: s.skinTone,
            stylePreferences: s.stylePreferences,
          });
          set({ isSaving: false, error: null });
          return true;
        } catch (error) {
          set({ isSaving: false, error: error instanceof Error ? error.message : "Failed to save onboarding data" });
          return false;
        }
      },
    }),
    {
      name: "onboarding-state",
      storage: createJSONStorage(() => secureStorage),
      partialize: ({ isSaving, error, ...state }) => state,
    },
  ),
);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => children;
