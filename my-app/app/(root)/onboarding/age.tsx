import { router } from "expo-router";
import { Text, View } from "react-native";

import { AgePicker } from "@/components/onboarding/AgePicker";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useOnboardingState } from "@/store/onboarding-store";

export default function AgeScreen() {
  const { age, setAge } = useOnboardingState();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingBottom: 24,
        paddingTop: 8,
      }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 24 }}>
        <OnboardingHeader step={2} />
      </View>

      {/* Title */}
      <Text
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 36,
          fontWeight: "600",
          letterSpacing: -0.5,
          color: "#1D1A27",
          paddingHorizontal: 24,
        }}
      >
        How old are you?
      </Text>

      {/* AgePicker vertically centered in remaining space */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <AgePicker age={age} onChange={setAge} />
      </View>

      {/* Continue button pinned to bottom */}
      <View style={{ paddingHorizontal: 24 }}>
        <ContinueButton
          onPress={() => router.push("/(root)/onboarding/height")}
        />
      </View>
    </View>
  );
}
