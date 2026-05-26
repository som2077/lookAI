import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import Svg, { Circle, G } from "react-native-svg";
import { IconCheck, IconX } from "@tabler/icons-react-native";
import { useOutfitAnalysisStore } from "@/backend/store/outfit-analysis-store";

const SVG_SIZE = 72;
const STROKE_WIDTH = 4.5;
const RADIUS = (SVG_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SVG_SIZE / 2;

export const OutfitAnalyzingCard = React.memo(function OutfitAnalyzingCard() {
  const { isAnalyzing, isDone, imageUri, progress, clearAnalysis } =
    useOutfitAnalysisStore();

  const strokeDashoffset = useMemo(
    () => CIRCUMFERENCE * (1 - Math.min(progress, 100) / 100),
    [progress],
  );

  if (!isAnalyzing && !isDone) return null;

  return (
    <View
      className="mx-6 mt-3 bg-white border border-[#E9EBF8] rounded-[20px] overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.09,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
      }}
    >
      <View className="flex-row items-center p-3 gap-3">
        {/* Left: image thumbnail with circular progress overlay */}
        <View
          className="rounded-2xl overflow-hidden"
          style={{ width: 82, height: 82 }}
        >
          {imageUri ? (
            <ExpoImage
              source={{ uri: imageUri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              blurRadius={isDone ? 0 : 5}
              cachePolicy="memory"
            />
          ) : (
            <View className="w-full h-full bg-[#E8E8E8]" />
          )}

          {/* Circular progress overlay while analyzing */}
          {!isDone && (
            <View
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.38)" }}
            >
              <Svg width={SVG_SIZE} height={SVG_SIZE}>
                {/* Track */}
                <Circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                {/* Progress arc */}
                <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
                  <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke="#ffffff"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>
              <Text
                className="absolute text-white font-bold"
                style={{ fontSize: 13 }}
              >
                {Math.round(progress)}%
              </Text>
            </View>
          )}

          {/* Done checkmark overlay */}
          {isDone && (
            <View
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.28)" }}
            >
              <View className="h-10 w-10 rounded-full bg-[#1D9E75] items-center justify-center">
                <IconCheck size={20} color="#ffffff" strokeWidth={3} />
              </View>
            </View>
          )}
        </View>

        {/* Right: text content */}
        <View className="flex-1">
          <Text
            className="text-[#1D1A27] font-bold mb-2"
            style={{ fontSize: 13.5 }}
          >
            {isDone ? "Analysis complete!" : "Analyzing cloth..."}
          </Text>

          {/* Skeleton placeholder lines */}
          <View className="h-[9px] rounded-full bg-[#EBEBEB] w-4/5 mb-[7px]" />
          <View className="h-[9px] rounded-full bg-[#EBEBEB] w-3/5 mb-[10px]" />

          <Text className="text-[#9B9BAF]" style={{ fontSize: 11 }}>
            {isDone ? "Tap × to dismiss" : "We'll notify you when done!"}
          </Text>
        </View>

        {/* Dismiss button */}
        <Pressable
          onPress={clearAnalysis}
          hitSlop={8}
          className="h-8 w-8 items-center justify-center rounded-full bg-[#F3F3F5]"
        >
          <IconX size={14} color="#9B9BAF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
});
