import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Svg, Circle } from "react-native-svg";

const TRACK_COLOR = "#F8F7FC" as const;

export interface RingProgressSegment {
  readonly id: string;
  readonly progress: number;
  readonly color: string;
  readonly radius: number;
  readonly strokeWidth: number;
}

export interface WardrobeRingSummaryCardProps {
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
    <View className="mt-3 bg-[#ffffff] border border-[#E9EBF8] shadow rounded-3xl py-4 ml-1 ">
      <View className="flex-row items-center justify-between gap-5  ml-1 mr-2">
        {/* Left Stats */}
        <View className="flex-1 items-end gap-9 py-1">
          <View className="items-end">
            <Text className="text-2xl  font-black text-[#F5B93A]">
              {formattedPercentage}
            </Text>
            <Text className="text-xs font-bold text-[#F5B93A]">
              Worn clothes
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-extrabold text-[#171421]">
              {totalWorn}
            </Text>
            <Text className="text-xs font-semibold text-[#868693]">
              Background
            </Text>
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
        <View className="flex-1 items-start gap-9 py-1">
          <View>
            <Text className="text-2xl font-black text-[#2A78FF]">
              {wearCount}
            </Text>
            <Text className="text-xs font-bold text-[#2A78FF]">
              Total wears
            </Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-[#E54B4B]">
              {neverCount}
            </Text>
            <Text className="text-xs font-bold text-[#E54B4B]">Never worn</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
