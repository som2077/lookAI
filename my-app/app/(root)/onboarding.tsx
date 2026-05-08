import { useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
  ViewToken,
} from "react-native";

const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus"];
const skinTones = ["#FDE8D0", "#F8D5B3", "#E9B283", "#C98E63", "#9A603C", "#6E4024"];
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

const AGE_MIN = 13;
const AGE_MAX = 70;
const AGE_ITEM_WIDTH = 96;
const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, idx) => AGE_MIN + idx);
const onboardingKey = (userId: string) => `onboarding_completed_${userId}`;

export default function OnboardingScreen() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [bodyType, setBodyType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const sideSpacer = (screenWidth - AGE_ITEM_WIDTH) / 2;
  const ageListRef = useRef<FlatList<number>>(null);

  const canContinue = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return age > 0;
    if (step === 3) return !!gender;
    if (step === 4) return !!bodyType;
    if (step === 5) return !!skinTone;
    if (step === 6) return stylePreferences.length === 3;
    return false;
  }, [step, age, gender, bodyType, skinTone, stylePreferences.length]);

  const onContinue = async () => {
    if (step < 6) {
      setStep((prev: number) => prev + 1);
      return;
    }

    setStep(7);
    setIsFinishing(true);

    if (user?.id) {
      await SecureStore.setItemAsync(onboardingKey(user.id), "true");
    }

    router.replace("/(root)/(tabs)");
  };

  const onBack = () => {
    if (step <= 1) {
      return;
    }

    setStep((prev) => prev - 1);
  };

  const toggleStyle = (style: string) => {
    setStylePreferences((prev: string[]) => {
      if (prev.includes(style)) return prev.filter((item: string) => item !== style);
      if (prev.length >= 3) return prev;
      return [...prev, style];
    });
  };

  const onAgeViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const centered = viewableItems.find((item) => item.isViewable && item.item != null);
      if (centered?.item) {
        setAge(centered.item);
      }
    }
  ).current;

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <View className="flex-1 px-6 pb-6 pt-2">
      {step >= 2 && step < 7 && (
        <Pressable onPress={onBack} className="mb-3 h-9 w-9 items-start justify-center">
          <Text className="text-3xl text-[#1D1A27]">‹</Text>
        </Pressable>
      )}
      {step === 1 && (
        <View className="flex-1 items-center justify-center gap-6">
          <Image source={require("../../assets/images/kribb.png")} className="h-56 w-56 rounded-3xl" resizeMode="cover" />
          <Text className="text-3xl font-bold text-gray-900">Welcome to LookAI</Text>
          <Text className="text-base text-gray-500 text-center">Let&apos;s personalize your experience in a few quick steps.</Text>
        </View>
      )}

      {step === 2 && (
        <View className="flex-1">
          <Text className="text-center text-5xl font-semibold tracking-tight text-[#1D1A27]">How old are you?</Text>

          <View className="mt-24 items-center">
            <Text className="text-7xl font-semibold text-black">{age}</Text>
            <Text className="mt-2 text-3xl text-[#D4DD56]">▲</Text>
          </View>

          <View className="mt-4 overflow-hidden rounded-2xl bg-[#A89AF4] py-5">
            <FlatList
              ref={ageListRef}
              data={ages}
              keyExtractor={(item) => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={AGE_ITEM_WIDTH}
              decelerationRate="fast"
              bounces={false}
              contentContainerStyle={{ paddingHorizontal: sideSpacer }}
              getItemLayout={(_, index) => ({ length: AGE_ITEM_WIDTH, offset: AGE_ITEM_WIDTH * index, index })}
              initialScrollIndex={age - AGE_MIN}
              viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
              onViewableItemsChanged={onAgeViewableItemsChanged}
              renderItem={({ item }) => {
                const selected = item === age;
                return (
                  <View className="items-center justify-center" style={{ width: AGE_ITEM_WIDTH }}>
                    <Text className={`font-semibold ${selected ? "text-5xl text-white" : "text-4xl text-[#5F52A2]"}`}>
                      {item}
                    </Text>
                  </View>
                );
              }}
            />

            <View
              pointerEvents="none"
              className="absolute inset-y-0 items-center justify-center border-x border-white/50"
              style={{ width: AGE_ITEM_WIDTH, left: sideSpacer }}
            />
          </View>
        </View>
      )}

      {step === 3 && (
        <View className="flex-1">
          <Text className="text-5xl font-semibold tracking-tight text-[#1D1A27]">Choose your Gender</Text>
          <Text className="mt-3 text-xl text-[#5A5566]">This will be used to calibrate your custom plan</Text>
          <View className="mt-16 items-center gap-8">
            {[
              { label: "Male", icon: "♂", bg: "#1E1A27", iconColor: "#FFFFFF" },
              { label: "Female", icon: "♀", bg: "#DCE754", iconColor: "#1E1A27" },
              { label: "Other", icon: "⚥", bg: "#5E59E6", iconColor: "#FFFFFF" },
            ].map((option) => {
              const selected = gender === option.label;
              return (
                <Pressable key={option.label} onPress={() => setGender(option.label as "Male" | "Female" | "Other")} className="items-center">
                  <View
                    className={`h-28 w-28 items-center justify-center rounded-full border-4 ${selected ? "border-[#1D1A27]" : "border-transparent"}`}
                    style={{ backgroundColor: option.bg }}
                  >
                    <Text className="text-6xl font-semibold" style={{ color: option.iconColor }}>
                      {option.icon}
                    </Text>
                  </View>
                  <Text className="mt-2 text-base font-semibold text-[#1D1A27]">{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {step === 4 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">Select your body type</Text>
          <View className="flex-row flex-wrap gap-3">
            {bodyTypes.map((type, idx) => (
              <Pressable key={type} onPress={() => setBodyType(type)} className={`w-[48%] rounded-2xl border p-3 ${bodyType === type ? "border-blue-600" : "border-gray-300"}`}>
                <View className="h-24 items-center justify-center rounded-xl bg-gray-100">
                  <Text className="text-4xl">{["🧍", "🏃", "🧑", "💃", "🕺"][idx]}</Text>
                </View>
                <Text className="mt-2 text-center text-base text-gray-800">{type}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 5 && (
        <View className="flex-1 gap-5">
          <Text className="text-3xl font-bold text-gray-900">Select your skin tone</Text>
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
          <Text className="text-3xl font-bold text-gray-900">Style preferences</Text>
          <Text className="text-sm text-gray-500">Choose exactly 3 styles</Text>
          <View className="flex-row flex-wrap gap-3">
            {styles.map((style) => {
              const selected = stylePreferences.includes(style);
              return (
                <Pressable key={style} onPress={() => toggleStyle(style)} className={`rounded-full border px-4 py-3 ${selected ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
                  <Text className="text-base text-gray-800">{style}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {step === 7 && (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-semibold text-gray-900">Setting up your account...</Text>
          <ActivityIndicator size="large" color="#2563EB" animating={isFinishing} />
        </View>
      )}

      {step < 7 && (
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          className={`mt-auto items-center rounded-2xl py-4 ${canContinue ? "bg-[#1A1827]" : "bg-gray-300"}`}
        >
          <Text className="text-white font-semibold text-base">Continue</Text>
        </Pressable>
      )}
      </View>
    </SafeAreaView>
  );
}
