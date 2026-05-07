import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { AppGradientBackground } from "@/components/ui/AppGradientBackground";

const getStartedLogo = require("../../assets/images/kribb.png");

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5EBE7", "#CACAD7"]}
      locations={[0.01, 0.35, 1]}
      start={{ x: 0.94, y: 0.15 }}
      end={{ x: 0.18, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-4 pb-6">
          <View className="flex-1 items-center justify-center">
            <Image source={getStartedLogo} className="h-14 w-56" resizeMode="contain" />

            <Text className="mt-3 text-[52px] font-semibold tracking-tight text-[#1D1A27]">Look AI</Text>

  return (
    // <AppGradientBackground>
    <SafeAreaView className="flex-1 ">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Get Started
        </Text>

        <TouchableOpacity
          onPress={onGetStartedPress}
          disabled={isSaving}
          className="w-full bg-red-900 py-4 rounded-xl items-center"
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Get Started</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    // </AppGradientBackground>
  );
}
