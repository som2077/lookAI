import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { CalendarDays, ChevronDown } from "lucide-react-native";

const TRACK_COLOR = "#C8C8D6" as const;

export interface RingProgressSegment {
  readonly id: string;
  readonly progress: number;
  readonly color: string;
  readonly radius: number;
  readonly strokeWidth: number;
}

export interface WardrobeRingSummaryCardProps {
  readonly greeting: string;
  readonly periodLabel: string;
  readonly wornPercentage: number;
  readonly totalWorn: number;
  readonly wearCount: number;
  readonly neverCount: number;
  readonly ringSegments: readonly RingProgressSegment[];
}

const clampProgress = (value: number) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

export function WardrobeRingSummaryCard({
  greeting,
  periodLabel,
  wornPercentage,
  totalWorn,
  wearCount,
  neverCount,
  ringSegments,
}: WardrobeRingSummaryCardProps) {
  const sanitizedSegments = useMemo(
    () =>
      ringSegments
        .slice()
        .sort((a, b) => b.radius - a.radius)
        .map((seg) => ({
          ...seg,
          progress: clampProgress(seg.progress),
        })),
    [ringSegments],
  );

  const svgSize = useMemo(() => {
    if (sanitizedSegments.length === 0) return 0;
    const maxExtent = sanitizedSegments.reduce((max, seg) => {
      const extent = seg.radius + seg.strokeWidth / 2;
      return extent > max ? extent : max;
    }, 0);
    return maxExtent * 2;
  }, [sanitizedSegments]);

  if (svgSize === 0) return null;

  const center = svgSize / 2;
  const formattedPercentage = Math.round(clampProgress(wornPercentage) * 100);

  return (
    <View className="mt-6 rounded-3xl bg-[#F8F7FC]/50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-5">
        <Text className="text-base font-extrabold text-[#171421]">
          {greeting}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Change period from ${periodLabel}`}
          className="flex-row items-center gap-2 rounded-full bg-[#171421] px-3 py-2"
        >
          <CalendarDays size={16} color="#FFFFFF" />
          <Text className="text-xs font-bold text-white">{periodLabel}</Text>
          <ChevronDown size={14} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Body: Left | Ring | Right */}
      <View className="flex-row items-center justify-between px-6 pb-6 pt-4">
        {/* Left Stats */}
        <View className="gap-5">
          <View>
            <Text className="text-3xl font-black text-[#F5B93A]">
              {formattedPercentage}%
            </Text>
            <Text className="text-sm font-bold text-[#F5B93A]">Worn</Text>
          </View>
          <View>
            <Text className="text-2xl font-extrabold text-[#171421]">
              {totalWorn}
            </Text>
            <Text className="text-sm font-semibold text-[#868693]">Worn</Text>
          </View>
        </View>

        {/* Center Ring */}
        <View className="items-center">
          <Svg width={svgSize} height={svgSize}>
            {sanitizedSegments.map((segment) => {
              const circumference = 2 * Math.PI * segment.radius;
              const dashArray = `${circumference} ${circumference}`;
              const dashOffset = circumference * (1 - segment.progress);

              return (
                <React.Fragment key={segment.id}>
                  {/* Track circle */}
                  <Circle
                    cx={center}
                    cy={center}
                    r={segment.radius}
                    stroke={TRACK_COLOR}
                    strokeWidth={segment.strokeWidth}
                    fill="transparent"
                  />
                  {/* Progress arc */}
                  <Circle
                    cx={center}
                    cy={center}
                    r={segment.radius}
                    stroke={segment.color}
                    strokeWidth={segment.strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    fill="transparent"
                    transform={`rotate(-90 ${center} ${center})`}
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        </View>

        {/* Right Stats */}
        <View className="items-end gap-5">
          <View className="items-end">
            <Text className="text-2xl font-black text-[#2A78FF]">
              {wearCount}
            </Text>
            <Text className="text-sm font-bold text-[#2A78FF]">Wear</Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-black text-[#E54B4B]">
              {neverCount}
            </Text>
            <Text className="text-sm font-bold text-[#E54B4B]">Never</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
