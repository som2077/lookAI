import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { CalendarDays } from "lucide-react-native";

export function HomeHeader() {
  const router = useRouter();
  const [streak] = useState<number>(1);

  return (
    <View className="flex-row items-center justify-between ">
      <Image
        source={require("../../assets/images/getStartedLogo.png")}
        className="h-16 w-56 mx-[-30]"
        resizeMode="contain"
      />

      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center rounded-full border border-[#E2E2EA] bg-white/70 px-3 py-1.5">
          <Text className="text-base">🔥</Text>
          <Text className="ml-1 text-sm font-semibold text-[#171421]">
            {streak}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(root)/calendar" as never)}
          className="items-center justify-center rounded-full border border-[#E2E2EA] bg-white/70 p-2"
          activeOpacity={0.7}
        >
          <CalendarDays size={18} color="#171421" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
