import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import {
  IconCalendarWeekFilled,
  IconFlameFilled,
} from "@tabler/icons-react-native";

export function HomeHeader() {
  const router = useRouter();
  const [streak] = useState<number>(1);

  return (
    <View className="flex-row items-center justify-between ">
      <Image
        source={require("../../assets/images/getStartedLogo.png")}
        className="h-16 w-56 ml-[-40]"
        resizeMode="contain"
      />

      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center rounded-full border border-[#E2E2EA] bg-[#F8F7FC] px-4 py-2">
          <Text className="text-base">
            <IconFlameFilled size={18} />
          </Text>
          <Text className="ml-1 text-sm font-semibold text-[#171421]">
            {streak} <Text className="text-sm">day</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(root)/calendar" as never)}
          className="items-center justify-center rounded-full border border-[#E2E2EA] bg-[#F8F7FC] px-2 py-2"
          activeOpacity={0.7}
        >
          <IconCalendarWeekFilled size={18} color="#171421" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
