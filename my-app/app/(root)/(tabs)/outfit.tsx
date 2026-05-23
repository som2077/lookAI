import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Wand2, Lock } from "lucide-react-native";
import { useBillingStore, selectIsPremium } from "@/billing/store";

export default function OutfitScreen() {
  const router = useRouter();
  const { entitlement } = useBillingStore();
  const isPremium = selectIsPremium(entitlement);

  return (
    <SafeAreaView className="flex-1 bg-[#0F0C1A] px-5 pt-4">
      <Text className="text-white text-2xl font-bold mb-1">
        AI Outfit Planner
      </Text>
      <Text className="text-[#8B8A9B] text-sm mb-6">
        Generate AI-powered outfit combinations from your wardrobe
      </Text>

      {isPremium ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 rounded-full bg-[#A78BFA]/20 items-center justify-center mb-4">
            <Wand2 size={36} color="#A78BFA" />
          </View>
          <Text className="text-white text-lg font-semibold text-center mb-2">
            Ready to create your outfit
          </Text>
          <Text className="text-[#8B8A9B] text-sm text-center">
            AI outfit generation coming soon
          </Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 rounded-full bg-[#EF4444]/10 items-center justify-center mb-5">
            <Lock size={36} color="#EF4444" />
          </View>
          <Text className="text-white text-xl font-bold text-center mb-2">
            Premium Feature
          </Text>
          <Text className="text-[#8B8A9B] text-sm text-center mb-8 px-4">
            Upgrade to Pro or Premium to unlock the AI Outfit Planner and
            generate unlimited outfit combinations.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)/subscription" as never)}
            className="bg-[#A78BFA] px-8 py-3.5 rounded-xl"
          >
            <Text className="text-white font-bold text-base">View Plans</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
