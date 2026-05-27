import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  IconFlameFilled,
  IconArrowLeft,
  IconTrophy,
} from "@tabler/icons-react-native";

const MOCK_WEEKLY: { day: string; done: boolean }[] = [
  { day: "Mon", done: true },
  { day: "Tue", done: true },
  { day: "Wed", done: false },
  { day: "Thu", done: true },
  { day: "Fri", done: true },
  { day: "Sat", done: false },
  { day: "Sun", done: true },
];

const MILESTONES = [
  { days: 7, label: "1 Week" },
  { days: 30, label: "1 Month" },
  { days: 100, label: "100 Days" },
  { days: 365, label: "1 Year" },
];

export default function StreakScreen() {
  const router = useRouter();
  const currentStreak = 1;
  const longestStreak = 5;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mr-3"
        >
          <IconArrowLeft size={24} color="#171421" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#171421]">Streak</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Current streak hero */}
        <View className="mx-5 mt-4 rounded-3xl bg-[#FFF4E0] px-6 py-8 items-center">
          <IconFlameFilled size={56} color="#F5A623" />
          <Text className="mt-3 text-5xl font-bold text-[#171421]">
            {currentStreak}
          </Text>
          <Text className="mt-1 text-base font-semibold text-[#868693]">
            Day Streak
          </Text>
          <Text className="mt-4 text-sm text-[#868693] text-center">
            Log an outfit every day to keep your streak alive!
          </Text>
        </View>

        {/* Stats row */}
        <View className="flex-row mx-5 mt-4 gap-3">
          <View className="flex-1 rounded-2xl bg-[#F8F7FC] border border-[#E2E2EA] p-4 items-center">
            <IconFlameFilled size={22} color="#F5A623" />
            <Text className="mt-2 text-2xl font-bold text-[#171421]">
              {currentStreak}
            </Text>
            <Text className="text-xs text-[#868693]">Current</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-[#F8F7FC] border border-[#E2E2EA] p-4 items-center">
            <IconTrophy size={22} color="#A78BFA" />
            <Text className="mt-2 text-2xl font-bold text-[#171421]">
              {longestStreak}
            </Text>
            <Text className="text-xs text-[#868693]">Best</Text>
          </View>
        </View>

        {/* Weekly activity */}
        <Text className="mx-5 mt-6 text-base font-bold text-[#171421]">
          This Week
        </Text>
        <View className="flex-row mx-5 mt-3 justify-between">
          {MOCK_WEEKLY.map(({ day, done }) => (
            <View key={day} className="items-center gap-1">
              <Text className="text-xs text-[#868693]">{day}</Text>
              <View
                className={`h-9 w-9 rounded-full items-center justify-center ${
                  done ? "bg-[#F5A623]" : "bg-[#F2F2F2] border border-[#E2E2EA]"
                }`}
              >
                {done && <IconFlameFilled size={16} color="#fff" />}
              </View>
            </View>
          ))}
        </View>

        {/* Milestones */}
        <Text className="mx-5 mt-6 text-base font-bold text-[#171421]">
          Milestones
        </Text>
        <View className="mx-5 mt-3 gap-3">
          {MILESTONES.map((m) => {
            const reached = currentStreak >= m.days;
            return (
              <View
                key={m.days}
                className={`flex-row items-center rounded-2xl p-4 border ${
                  reached
                    ? "bg-[#FFF4E0] border-[#F5A623]"
                    : "bg-[#F8F7FC] border-[#E2E2EA]"
                }`}
              >
                <IconTrophy size={20} color={reached ? "#F5A623" : "#C7C7C7"} />
                <Text
                  className={`ml-3 text-sm font-semibold ${
                    reached ? "text-[#171421]" : "text-[#868693]"
                  }`}
                >
                  {m.label}
                </Text>
                <Text className="ml-auto text-xs text-[#868693]">
                  {m.days} days
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
