import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-transparent px-5 pt-4">
      <View className="rounded-3xl bg-white/55 p-5 shadow-sm">
        <Text className="text-2xl font-semibold text-[#171421]">Profile</Text>
      </View>
    </SafeAreaView>
  );
}
