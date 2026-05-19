import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CheckCircle, Sparkles } from "lucide-react-native";

export default function PaymentSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0F0C1A]">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 rounded-full bg-[#22C55E]/20 items-center justify-center mb-6">
          <CheckCircle size={48} color="#22C55E" />
        </View>

        <Text className="text-white text-3xl font-bold text-center mb-3">
          Payment Successful!
        </Text>

        <Text className="text-[#8B8A9B] text-base text-center mb-2">
          Your subscription is now active.
        </Text>

        <View className="flex-row items-center mb-10">
          <Sparkles size={16} color="#A78BFA" />
          <Text className="text-[#A78BFA] text-sm ml-2">
            All premium features are unlocked
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(root)/(tabs)" as never)}
          className="bg-[#A78BFA] w-full py-4 rounded-xl items-center mb-4"
        >
          <Text className="text-white font-bold text-base">Start Exploring</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(root)/(tabs)/subscription" as never)}
          className="w-full py-4 rounded-xl items-center"
        >
          <Text className="text-[#8B8A9B] text-sm">View Subscription Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
