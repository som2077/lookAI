import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";
import { HomeHeader } from "../../../components/ui/HomeHeader";
import { WeeklyCalendarStrip } from "../../../components/ui/WeeklyCalendarStrip";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";

export default function HomeScreen() {
  return (
    <SwipeTabWrapper tabIndex={0}>
      <AppGradientBackground>
        <SafeAreaView className="flex-1 px-7">
          <HomeHeader />
          <WeeklyCalendarStrip />
          <View className="mt-2 rounded-3xl border border-[#E2E2EA] bg-[#F8F7FC] px-5 shadow-sm">
            <Text className="text-base font-semibold text-[#171421]">
              No habits yet
            </Text>
            <Text className="mt-1 text-sm text-[#868693]">
              Start building your habit streak today!
            </Text>
          </View>
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
