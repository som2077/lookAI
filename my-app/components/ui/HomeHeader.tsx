import React, { useCallback } from "react";
import { CURRENT_STREAK_DAYS } from "@/constants/streak";
import { Image as ExpoImage } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import {
  IconFlameFilled,
  IconCalendar,
} from "@tabler/icons-react-native";

export const HomeHeader = React.memo(function HomeHeader() {
  const router = useRouter();
  const streak = CURRENT_STREAK_DAYS;

  return (
    <View className="flex-row items-center justify-between ">
      <ExpoImage
        source={require("../../assets/images/getStartedLogo.png")}
        style={{ height: 70, width: 224, marginLeft: -40 }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => router.push("/(root)/streak" as never)}
          activeOpacity={0.7}
          className="flex-row items-center rounded-full border border-[#E2E2EA] bg-[#F8F7FC] px-4 py-[9.9px]"
        >
          <Text className="text-base">
            <IconFlameFilled size={18} />
          </Text>
          <Text className="ml-1 text-sm font-semibold text-[#171421]">
            {streak} <Text className="text-sm">day</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(root)/calendar" as never)}
          activeOpacity={0.7}
          className="flex-row items-center rounded-full border border-[#E2E2EA] bg-[#F8F7FC] p-[9.9px]"
        >
          <IconCalendar size={20} color="#171421" />
        </TouchableOpacity>
      </View>
    </View>
  );
});
