import { SafeAreaView } from "react-native-safe-area-context";
import { BodyTypeCard, type BodyTypeOption } from "@/components/onboarding/BodyTypeCard";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "@/components/onboarding/BackButton";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { useOnboardingState } from "@/store/onboarding-store";

const maleBodyTypes: BodyTypeOption[] = [
  { id: "slim",     title: "Slim",     image: require("@/assets/bodytypes/male/slim.png")     },
  { id: "athletic", title: "Athletic", image: require("@/assets/bodytypes/male/Athletic.png") }, // ✅ capital A
  { id: "average",  title: "Average",  image: require("@/assets/bodytypes/male/Average.png")  }, // ✅ capital A
  { id: "plus",     title: "Plus",     image: require("@/assets/bodytypes/male/plus.png")     },
];

const femaleBodyTypes: BodyTypeOption[] = [
  { id: "slim",    title: "Slim",    image: require("@/assets/bodytypes/female/slim.png")    },
  { id: "curvy",   title: "Curvy",   image: require("@/assets/bodytypes/female/Curvy.png")   }, // ✅ capital C
  { id: "average", title: "Average", image: require("@/assets/bodytypes/female/Average.png") }, // ✅ capital A
  { id: "plus",    title: "Plus",    image: require("@/assets/bodytypes/female/Plus.png")    }, // ✅ capital P
];

export default function BodyTypesScreen() {
  const { gender, bodyType, setBodyType } = useOnboardingState();
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(bodyType || null);

  const bodyTypes = useMemo(() => {
    const normalizedGender = gender.toLowerCase();
    return normalizedGender === "female" ? femaleBodyTypes : maleBodyTypes;
  }, [gender]);

  const handleContinue = () => {
    if (!selectedBodyType) return;
    setBodyType(selectedBodyType);
    router.push("/(root)/onboarding/skin-tone");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pb-6 pt-2">
        <BackButton onPress={() => router.back()} />
        <ProgressIndicator step={5} />
        <Text className="text-5xl font-semibold tracking-tight text-[#1D1A27]">Body types</Text>
        <Text className="mt-3 text-base leading-6 text-[#5A5566]">
          Select the range that best represents you to find fashion inspiration with you in mind.
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
              onPress={() => setSelectedBodyType(item.id)}
            />
          )}
        />

        <View className="absolute inset-x-5 bottom-6">
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!selectedBodyType}
            onPress={handleContinue}
            className={`items-center rounded-2xl py-4 ${
              selectedBodyType ? "bg-[#1B1623]" : "bg-[#1B1623]/40"
            }`}
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}