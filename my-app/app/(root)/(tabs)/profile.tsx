import { useAuth } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Crown } from "lucide-react-native";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogoutPress = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent px-5 pt-4">
      <View className="rounded-3xl bg-white/55 p-5 shadow-sm">
        <Text className="text-2xl font-semibold text-[#171421]">Profile</Text>

        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/subscription" as never)}
          className="mt-6 w-full rounded-2xl bg-[#2E2A3B] py-4 px-5 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Crown size={20} color="#A78BFA" />
            <Text className="text-base font-semibold text-white ml-3">
              Manage Subscription
            </Text>
          </View>
          <Text className="text-[#A78BFA] text-sm">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogoutPress}
          disabled={isLoggingOut}
          className="mt-3 w-full rounded-2xl bg-[#1A1827] py-4 items-center"
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-semibold text-white">Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
