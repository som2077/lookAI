import { useAuth } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useAuth();
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
          onPress={onLogoutPress}
          disabled={isLoggingOut}
          className="mt-6 w-full rounded-2xl bg-[#1A1827] py-4 items-center"
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
