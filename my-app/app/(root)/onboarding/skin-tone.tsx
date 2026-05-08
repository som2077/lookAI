import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { BackButton } from "./components/BackButton";
import { ContinueButton } from "./components/ContinueButton";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useOnboardingState } from "./state";

const tones = ["#FDE8D0", "#F8D5B3", "#E9B283", "#C98E63", "#9A603C", "#6E4024"];

export default function SkinToneScreen() {
  const { skinTone, setSkinTone } = useOnboardingState();
  return <SafeAreaView className="flex-1"><View className="flex-1 gap-5 px-6 pb-6 pt-2"><BackButton onPress={() => router.back()} /><ProgressIndicator step={6} /><Text className="text-3xl font-bold text-gray-900">Select your skin tone</Text><View className="flex-row flex-wrap gap-3">{tones.map((tone) => <Pressable key={tone} onPress={() => setSkinTone(tone)} className={`h-16 w-16 rounded-full border-2 ${skinTone === tone ? "border-blue-600" : "border-transparent"}`} style={{ backgroundColor: tone }} />)}</View><ContinueButton onPress={() => router.push("/(root)/onboarding/style-preference")} disabled={!skinTone} /></View></SafeAreaView>;
}
