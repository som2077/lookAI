import { useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus"];
const skinTones = [
  "#FDE8D0",
  "#F8D5B3",
  "#E9B283",
  "#C98E63",
  "#9A603C",
  "#6E4024",
];
const styles = [
  "Casual",
  "Streetwear",
  "Minimal",
  "Sporty",
  "Formal",
  "Vintage",
  "Bohemian",
  "Smart Casual",
];

const onboardingKey = (userId: string) => `onboarding_completed_${userId}`;

export default function OnboardingScreen() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [bodyType, setBodyType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return Number(age) > 0;
    if (step === 3) return !!gender;
    if (step === 4) return !!bodyType;
    if (step === 5) return !!skinTone;
    if (step === 6) return stylePreferences.length === 3;
    return false;
  }, [step, age, gender, bodyType, skinTone, stylePreferences.length]);

  const onContinue = async () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
      return;
    }

    setStep(7);
    setIsFinishing(true);

    if (user?.id) {
      await SecureStore.setItemAsync(onboardingKey(user.id), "true");
    }

    router.replace("/(root)/(tabs)");
  };

  const toggleStyle = (style: string) => {
    setStylePreferences((prev) => {
      if (prev.includes(style)) {
        return prev.filter((item) => item !== style);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, style];
    });
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 24, flexGrow: 1 }}
    >
      {step === 1 && (
        <View className="flex-1 items-center justify-center gap-6">
          <Image
            source={require("../../assets/images/kribb.png")}
            className="h-56 w-56 rounded-3xl"
            resizeMode="cover"
          />
          <Text className="text-3xl font-bold text-gray-900">
            Welcome to LookAI
          </Text>
          <Text className="text-base text-gray-500 text-center">
            Let&apos;s personalize your experience in a few quick steps.
          </Text>
        </View>
      )}

      {step === 2 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">
            Select your age
          </Text>
          <TextInput
            keyboardType="number-pad"
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            className="border border-gray-300 rounded-xl px-4 py-3 text-lg"
            maxLength={2}
          />
        </View>
      )}

      {step === 3 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">
            Select your gender
          </Text>
          {["Male", "Female", "Other"].map((option) => (
            <Pressable
              key={option}
              onPress={() => setGender(option as "Male" | "Female" | "Other")}
              className={`rounded-xl border px-4 py-4 ${gender === option ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
            >
              <Text className="text-lg text-gray-800">{option}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 4 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">
            Select your body type
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {bodyTypes.map((type, idx) => (
              <Pressable
                key={type}
                onPress={() => setBodyType(type)}
                className={`w-[48%] rounded-2xl border p-3 ${bodyType === type ? "border-blue-600" : "border-gray-300"}`}
              >
                <View className="h-24 items-center justify-center rounded-xl bg-gray-100">
                  <Text className="text-4xl">
                    {["🧍", "🏃", "🧑", "💃", "🕺"][idx]}
                  </Text>
                </View>
                <Text className="mt-2 text-center text-base text-gray-800">
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 5 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">
            Select your skin tone
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {skinTones.map((tone) => (
              <Pressable
                key={tone}
                onPress={() => setSkinTone(tone)}
                className={`h-16 w-16 rounded-full border-2 ${skinTone === tone ? "border-blue-600" : "border-transparent"}`}
                style={{ backgroundColor: tone }}
              />
            ))}
          </View>
        </View>
      )}

      {step === 6 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">
            Style preferences
          </Text>
          <Text className="text-sm text-gray-500">Choose exactly 3 styles</Text>
          <View className="flex-row flex-wrap gap-3">
            {styles.map((style) => {
              const selected = stylePreferences.includes(style);
              return (
                <Pressable
                  key={style}
                  onPress={() => toggleStyle(style)}
                  className={`rounded-full border px-4 py-3 ${selected ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
                >
                  <Text className="text-base text-gray-800">{style}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {step === 7 && (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-semibold text-gray-900">
            Setting up your account...
          </Text>
          <ActivityIndicator
            size="large"
            color="#2563EB"
            animating={isFinishing}
          />
        </View>
      )}

      {step < 7 && (
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          className={`mt-auto rounded-xl py-4 items-center ${canContinue ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <Text className="text-white font-semibold text-base">Continue</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
