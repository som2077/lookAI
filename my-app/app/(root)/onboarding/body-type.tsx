import { router } from "expo-router";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { BackButton } from "./components/BackButton";
import { ContinueButton } from "./components/ContinueButton";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useOnboardingState } from "./state";
import { BodyTypeCard, type BodyTypeOption } from "@/components/onboarding/BodyTypeCard";

const maleBodyTypes: BodyTypeOption[] = [
  { id: "slim", title: "Slim", image: require("@/assets/bodytypes/male/slim.png") },
  { id: "athletic", title: "Athletic", image: require("@/assets/bodytypes/male/athletic.png") },
  { id: "average", title: "Average", image: require("@/assets/bodytypes/male/average.png") },
  { id: "plus", title: "Plus", image: require("@/assets/bodytypes/male/plus.png") },
];

const femaleBodyTypes: BodyTypeOption[] = [
  { id: "slim", title: "Slim", image: require("@/assets/bodytypes/female/slim.png") },
  { id: "curvy", title: "Curvy", image: require("@/assets/bodytypes/female/curvy.png") },
  { id: "average", title: "Average", image: require("@/assets/bodytypes/female/average.png") },
  { id: "plus", title: "Plus", image: require("@/assets/bodytypes/female/plus.png") },
];

export default function BodyTypesScreen() {
  const { gender, bodyType, setBodyType } = useOnboardingState();
  const bodyTypes = gender === "Female" ? femaleBodyTypes : maleBodyTypes;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F7FB]">
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
              selected={bodyType === item.id}
              onPress={() => setBodyType(item.id)}
            />
          )}
        />

        <View className="absolute inset-x-5 bottom-6">
          <ContinueButton
            disabled={!bodyType}
            onPress={() => router.push("/(root)/onboarding/skin-tone")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
