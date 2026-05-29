import React from "react";
import { Pressable, Text, View } from "react-native";
import { IconChartLine, IconCrown } from "@tabler/icons-react-native";

const MOCK_TRENDS = [
  {
    id: 1,
    title: "Palazzo Pants",
    subtitle: "Trending in Indore",
    icon: "chart",
  },
  {
    id: 2,
    title: "Ethnic Fusion",
    subtitle: "Bollywood Inspired",
    icon: "chart",
  },
  {
    id: 3,
    title: "Look of Week",
    subtitle: "Premium *",
    icon: "crown",
  },
];

export const TrendFeed = React.memo(function TrendFeed() {
  return (
    <View className="mt-4 mb-2">
      {/* Header with title and see all */}
      <View className="flex-row items-center justify-between mx-8 mb-3">
        <Text className="text-[#1D1A27] text-lg font-bold">Trend Feed</Text>
        <Pressable>
          <Text className="text-[#9B9BAF] text-sm">see all</Text>
        </Pressable>
      </View>

      {/* Trend cards */}
      <View className="flex-row gap-3 mx-5">
        {MOCK_TRENDS.map((trend) => (
          <View
            key={trend.id}
            className="flex-1 bg-white rounded-[16px] border border-[#E9EBF8] px-3 py-10"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
              elevation: 1,
            }}
          >
            {/* Icon */}
            <View
              className="w-8 h-8 rounded-full items-center justify-center mb-2"
              style={{
                backgroundColor: trend.icon === "crown" ? "#F5B93A" : "#E54B4B",
              }}
            >
              {trend.icon === "crown" ? (
                <IconCrown size={16} color="#ffffff" strokeWidth={2} />
              ) : (
                <IconChartLine size={16} color="#ffffff" strokeWidth={2} />
              )}
            </View>

            {/* Title */}
            <Text
              className="text-[#1D1A27] font-bold mb-1"
              style={{ fontSize: 13 }}
            >
              {trend.title}
            </Text>

            {/* Subtitle */}
            <Text className="text-[#9B9BAF]" style={{ fontSize: 11 }}>
              {trend.subtitle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
