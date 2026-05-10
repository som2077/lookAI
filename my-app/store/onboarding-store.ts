import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

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
  completeOnboarding: (userId: string) => Promise<boolean>;
};

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const useOnboardingState = create<OnboardingState>()(
  persist(
    (set) => ({
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
      completeOnboarding: async (userId: string) => {
        set({ isSaving: true, error: null });
        try {
          await SecureStore.setItemAsync(`onboarding_complete_${userId}`, "true");
          set({ isSaving: false });
          return true;
        } catch {
          set({ isSaving: false, error: "Failed to save onboarding" });
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
