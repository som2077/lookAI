import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

export type Gender = "Male" | "Female" | "Other" | "";

type OnboardingState = {
  age: number;
  setAge: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  gender: Gender;
  setGender: (value: Gender) => void;
  bodyType: string;
  setBodyType: (value: string) => void;
  skinTone: string;
  setSkinTone: (value: string) => void;
  stylePreferences: string[];
  toggleStyle: (value: string) => void;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(165);
  const [gender, setGender] = useState<Gender>("");
  const [bodyType, setBodyType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      age,
      setAge,
      height,
      setHeight,
      gender,
      setGender,
      bodyType,
      setBodyType,
      skinTone,
      setSkinTone,
      stylePreferences,
      toggleStyle: (style: string) => {
        setStylePreferences((prev) => {
          if (prev.includes(style)) return prev.filter((item) => item !== style);
          if (prev.length >= 3) return prev;
          return [...prev, style];
        });
      },
    }),
    [age, height, gender, bodyType, skinTone, stylePreferences],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingState() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboardingState must be used inside onboarding routes.");
  return context;
}
