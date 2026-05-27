import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconShirt,
} from "@tabler/icons-react-native";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const LOGGED_OUTFITS: Record<string, string> = {
  [new Date().toDateString()]: "outfit",
};

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);

  const days = useMemo(
    () => buildCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const goToPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectedOutfit = LOGGED_OUTFITS[selected.toDateString()];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mr-3"
        >
          <IconArrowLeft size={24} color="#171421" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#171421]">Outfit Calendar</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Month navigator */}
        <View className="flex-row items-center justify-between mx-5 mt-4">
          <TouchableOpacity onPress={goToPrev} activeOpacity={0.7} className="p-2">
            <IconChevronLeft size={22} color="#171421" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-[#171421]">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <TouchableOpacity onPress={goToNext} activeOpacity={0.7} className="p-2">
            <IconChevronRight size={22} color="#171421" />
          </TouchableOpacity>
        </View>

        {/* Day labels */}
        <View className="flex-row mx-5 mt-4">
          {DAY_LABELS.map((d) => (
            <Text
              key={d}
              className="flex-1 text-center text-xs font-semibold text-[#868693]"
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="mx-5 mt-2">
          {Array.from({ length: days.length / 7 }, (_, weekIdx) => (
            <View key={weekIdx} className="flex-row mb-2">
              {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((date, cellIdx) => {
                if (!date) {
                  return <View key={cellIdx} className="flex-1 mx-1 h-10" />;
                }
                const isToday = isSameDay(date, today);
                const isSelected = isSameDay(date, selected);
                const hasOutfit = !!LOGGED_OUTFITS[date.toDateString()];

                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    onPress={() => setSelected(date)}
                    activeOpacity={0.7}
                    className={`flex-1 mx-1 h-10 rounded-full items-center justify-center ${
                      isSelected
                        ? "bg-[#171421]"
                        : isToday
                        ? "bg-[#F8F7FC] border border-[#171421]"
                        : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? "text-white" : "text-[#171421]"
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                    {hasOutfit && (
                      <View
                        className={`absolute bottom-1 h-1 w-1 rounded-full ${
                          isSelected ? "bg-white" : "bg-[#A78BFA]"
                        }`}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Selected day detail */}
        <View className="mx-5 mt-4 rounded-2xl bg-[#F8F7FC] border border-[#E2E2EA] p-5">
          <Text className="text-sm font-bold text-[#171421]">
            {selected.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          {selectedOutfit ? (
            <View className="flex-row items-center mt-3">
              <IconShirt size={20} color="#A78BFA" />
              <Text className="ml-2 text-sm text-[#171421]">Outfit logged</Text>
            </View>
          ) : (
            <Text className="mt-3 text-sm text-[#868693]">
              No outfit logged for this day.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
