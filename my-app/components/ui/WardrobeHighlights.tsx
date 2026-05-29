import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";

const SVG_SIZE = 40;
const STROKE_WIDTH = 3;
const RADIUS = (SVG_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SVG_SIZE / 2;

const MOCK_HIGHLIGHTS = {
  new: [
    { id: 1, title: "Floral dress", wears: 0, addedToday: true },
    { id: 2, title: "Floral dress", wears: 0, addedToday: true },
  ],
  hot: [
    { id: 3, title: "Floral dress", wears: 9, lastWorn: "today" },
    { id: 4, title: "Floral dress", wears: 9, lastWorn: "today" },
  ],
};

const ProgressCircle = React.memo(function ProgressCircle({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Svg width={SVG_SIZE} height={SVG_SIZE}>
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        stroke="#EBEBEB"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${CENTER}, ${CENTER}`}
      />
    </Svg>
  );
});

const HighlightCard = React.memo(function HighlightCard({
  title,
  wears,
  tag,
  tagColor,
  progressColor,
  subtitle,
}: {
  title: string;
  wears: number;
  tag: string;
  tagColor: string;
  progressColor: string;
  subtitle: string;
}) {
  const progress = Math.min(wears / 10, 1); // Assuming 10 wears = full circle

  return (
    <View
      className="bg-white rounded-[12px] border border-[#E9EBF8] px-3 py-6 mb-2"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {/* Header with title and tag */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[#1D1A27] font-bold" style={{ fontSize: 13 }}>
          {title}
        </Text>
        <View
          className="px-2 py-[2px] rounded-full"
          style={{ backgroundColor: tagColor }}
        >
          <Text className="text-white text-[10px] font-bold">{tag}</Text>
        </View>
      </View>

      {/* Progress and subtitle */}
      <View className="flex-row items-center gap-2">
        <ProgressCircle progress={progress} color={progressColor} />
        <Text className="text-[#9B9BAF]" style={{ fontSize: 11 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
});

export const WardrobeHighlights = React.memo(function WardrobeHighlights() {
  const router = useRouter();

  return (
    <View className="mt-4 mb-2">
      {/* Header */}
      <View className="flex-row items-center justify-between mx-8 mb-3">
        <Text className="text-[#1D1A27] text-lg font-bold">
          Wardrobe highlights
        </Text>
        <TouchableOpacity
          onPress={() => router.navigate("/(root)/(tabs)/wardrobe" as never)}
        >
          <Text className="text-[#6C63FF] text-sm font-semibold">
            All items
          </Text>
        </TouchableOpacity>
      </View>

      {/* Two columns */}
      <View className="flex-row gap-3 mx-5">
        {/* New column */}
        <View className="flex-1">
          {MOCK_HIGHLIGHTS.new.map((item) => (
            <HighlightCard
              key={item.id}
              title={item.title}
              wears={item.wears}
              tag="new"
              tagColor="#E54B4B"
              progressColor="#E54B4B"
              subtitle={`${item.wears} wears / Added today`}
            />
          ))}
        </View>

        {/* Hot column */}
        <View className="flex-1">
          {MOCK_HIGHLIGHTS.hot.map((item) => (
            <HighlightCard
              key={item.id}
              title={item.title}
              wears={item.wears}
              tag="Hot"
              tagColor="#1D9E75"
              progressColor="#1D9E75"
              subtitle={`${item.wears} wears / Last: ${item.lastWorn}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
});
