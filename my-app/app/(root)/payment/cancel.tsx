import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { XCircle, RefreshCw } from "lucide-react-native";

export default function PaymentCancelScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0F0C1A]">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 rounded-full bg-[#EF4444]/20 items-center justify-center mb-6">
          <XCircle size={48} color="#EF4444" />
        </View>

        <Text className="text-white text-3xl font-bold text-center mb-3">
          Payment Failed
        </Text>

        <Text className="text-[#8B8A9B] text-base text-center mb-10">
          Something went wrong or the payment was cancelled. Your account has not been charged.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/(root)/(tabs)/subscription" as never)}
          className="bg-[#A78BFA] w-full py-4 rounded-xl items-center mb-4 flex-row justify-center"
        >
          <RefreshCw size={18} color="#fff" />
          <Text className="text-white font-bold text-base ml-2">Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(root)/(tabs)" as never)}
          className="w-full py-4 rounded-xl items-center"
        >
          <Text className="text-[#8B8A9B] text-sm">Go Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
