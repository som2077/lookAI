import {
  BodyTypeCard,
  type BodyTypeOption,
} from "@/components/onboarding/BodyTypeCard";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/backend/store/onboarding-store";

const maleBodyTypes: BodyTypeOption[] = [
  {
    id: "slim",
    title: "Slim",
    description: "Slim body type has a lean frame with low body fat.",
    image: require("@/assets/bodytypes/male/slim.png"),
  },
  {
    id: "athletic",
    title: "Athletic",
    description:
      "Athletic body type has toned muscles, balanced proportions, and a strong appearance.",
    image: require("@/assets/bodytypes/male/athletic.png"),
  },
  {
    id: "average",
    title: "Average",
    description:
      "Average body type has balanced proportions with moderate body fat and muscle.",
    image: require("@/assets/bodytypes/male/average.png"),
  },
  {
    id: "plus",
    title: "Plus",
    description:
      "A plus-size body looks strong, confident, and naturally curvier overall.",
    image: require("@/assets/bodytypes/male/plus.png"),
  },
];

const femaleBodyTypes: BodyTypeOption[] = [
  {
    id: "slim",
    title: "Slim",
    description: "Slim body type has a lean frame with low body fat.",
    image: require("@/assets/bodytypes/female/slim.png"),
  },
  {
    id: "curvy",
    title: "Curvy",
    description:
      "Curvy body type has defined curves with fuller hips, waist, and chest.",
    image: require("@/assets/bodytypes/female/curvy.png"),
  },
  {
    id: "average",
    title: "Average",
    description:
      "Average body type has balanced proportions with moderate body fat and muscle.",
    image: require("@/assets/bodytypes/female/average.png"),
  },
  {
    id: "plus",
    title: "Plus",
    description:
      "A plus-size body looks strong, confident, and naturally curvier overall.",
    image: require("@/assets/bodytypes/female/plus.png"),
  },
];

export default function BodyTypesScreen() {
  const { gender, bodyType, setBodyType } = useOnboardingState();
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(
    bodyType || null,
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bodyTypes = useMemo(() => {
    if (!gender) return maleBodyTypes;
    return gender.toLowerCase() === "female" ? femaleBodyTypes : maleBodyTypes;
  }, [gender]);

  const handleContinue = () => {
    if (!selectedBodyType) return;
    setBodyType(selectedBodyType);
    router.push("/(root)/onboarding/style-preference");
  };

  return (
    // <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 px-5 pb-6 pt-2">
      <OnboardingHeader step={4} />
      <Text className="text-4xl font-semibold px-3 tracking-tight text-[#1D1A27]">
        Body types
      </Text>
      <Text className="mt-2 text-left text-xl px-3 text-[#000000]">
        This will be used to calibrate your custom plan
      </Text>

      <FlatList
        data={bodyTypes}
        keyExtractor={(item) => item.id}
        className="mt-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, gap: 16 }}
        renderItem={({ item, index }) => (
          <BodyTypeCard
            item={item}
            index={index}
            selected={selectedBodyType === item.id}
            expanded={expandedId === item.id}
            onPress={() => {
              setSelectedBodyType(item.id);
              setExpandedId(item.id);
            }}
          />
        )}
      />

      <View className="absolute inset-x-5 bottom-6">
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!selectedBodyType}
          onPress={handleContinue}
          className={`items-center rounded-2xl py-5 ${selectedBodyType ? "bg-[#000000]" : "bg-[#1B1623]"}`}
        >
          <Text className="text-base font-semibold text-white">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </SafeAreaView>
  );
}
