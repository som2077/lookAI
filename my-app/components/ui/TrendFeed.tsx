import React from "react";
import { Pressable, Text, View } from "react-native";
import { IconChartLine, IconCrown } from "@tabler/icons-react-native";
import { ChevronRight } from "lucide-react-native";

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
    <View className="mt-4 mb-20">
      {/* Header with title and see all */}
      <View className="flex-row items-center justify-between mx-8 mb-3">
        <Text className="text-[#1D1A27] text-xl font-bold">Trend Feed</Text>
        <Pressable>
          <ChevronRight size={20} color="#000000" strokeWidth={2} />
        </Pressable>
      </View>

      {/* Trend cards */}
      <View className="flex-row gap-3 mx-6">
        {MOCK_TRENDS.map((trend) => (
          <View
            key={trend.id}
            className="flex-1 bg-white rounded-[16px] border border-[#E9EBF8] p-1"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
              elevation: 1,
            }}
          >
            {/* Inner card with icon */}
            <View
              className="w-full aspect-square rounded-[12px] items-center justify-center mb-3"
              style={{
                backgroundColor: "#F4F4F6",
                borderWidth: 1,
                borderColor: "#E9EBF8",
              }}
            >
              {trend.icon === "crown" ? (
                <IconCrown size={32} color="#1D1A27" strokeWidth={1.5} />
              ) : (
                <IconChartLine size={32} color="#1D1A27" strokeWidth={1.5} />
              )}
            </View>

            {/* Title */}
            <Text
              className="text-[#1D1A27] font-bold mb-1 ml-1"
              style={{ fontSize: 13 }}
            >
              {trend.title}
            </Text>

            {/* Subtitle */}
            <Text className="text-[#9B9BAF] mb-2 ml-1" style={{ fontSize: 11 }}>
              {trend.subtitle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
