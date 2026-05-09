import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { BackButton } from "./components/BackButton";
import { ContinueButton } from "./components/ContinueButton";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useOnboardingState } from "./state";

export default function GenderScreen() {
  const { gender, setGender } = useOnboardingState();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 pb-6 pt-2">
        <BackButton onPress={() => router.back()} />
        <ProgressIndicator step={4} />
        <Text className="text-5xl font-semibold tracking-tight text-[#1D1A27]">
          Choose your Gender
        </Text>
        <Text className="mt-3 text-xl text-[#5A5566]">
          This will be used to calibrate your custom plan
        </Text>
        <View className="mt-16 items-center gap-8">
          {[
            { label: "Male", icon: "♂", bg: "#1E1A27", iconColor: "#FFFFFF" },
            { label: "Female", icon: "♀", bg: "#DCE754", iconColor: "#1E1A27" },
            { label: "Other", icon: "⚥", bg: "#5E59E6", iconColor: "#FFFFFF" },
          ].map((o) => (
            <Pressable
              key={o.label}
              onPress={() => setGender(o.label as any)}
              className="items-center"
            >
              <View
                className={`h-28 w-28 items-center justify-center rounded-full border-4 ${gender === o.label ? "border-[#1D1A27]" : "border-transparent"}`}
                style={{ backgroundColor: o.bg }}
              >
                <Text
                  className="text-6xl font-semibold"
                  style={{ color: o.iconColor }}
                >
                  {o.icon}
                </Text>
              </View>
              <Text className="mt-2 text-base font-semibold text-[#1D1A27]">
                {o.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <ContinueButton
          onPress={() => router.push("/(root)/onboarding/body-type")}
          disabled={!gender}
        />
      </View>
    </SafeAreaView>
  );
}
