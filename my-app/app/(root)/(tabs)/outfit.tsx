import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OutfitScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#ECEDF9] px-5 pt-4">
      <View className="rounded-3xl  p-5 shadow-sm">
        <Text className="text-2xl font-semibold text-[#171421]">AI Outfit Planner</Text>
      </View>
    </SafeAreaView>
  );
}
