import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { BackButton } from "./components/BackButton";
import { ContinueButton } from "./components/ContinueButton";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useOnboardingState } from "./state";

const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus"];
const icons = ["🧍", "🏃", "🧑", "💃", "🕺"];

export default function BodyTypeScreen() {
  const { bodyType, setBodyType } = useOnboardingState();
  return <SafeAreaView className="flex-1"><View className="flex-1 gap-5 px-6 pb-6 pt-2"><BackButton onPress={() => router.back()} /><ProgressIndicator step={5} /><Text className="text-3xl font-bold text-gray-900">Select your body type</Text><View className="flex-row flex-wrap gap-3">{bodyTypes.map((type, idx) => <Pressable key={type} onPress={() => setBodyType(type)} className={`w-[48%] rounded-2xl border p-3 ${bodyType === type ? "border-blue-600" : "border-gray-300"}`}><View className="h-24 items-center justify-center rounded-xl bg-gray-100"><Text className="text-4xl">{icons[idx]}</Text></View><Text className="mt-2 text-center text-base text-gray-800">{type}</Text></Pressable>)}</View><ContinueButton onPress={() => router.push("/(root)/onboarding/skin-tone")} disabled={!bodyType} /></View></SafeAreaView>;
}
