import { ChevronDown, ChevronRight, Check } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import { Image as ExpoImage } from "expo-image";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type BodyTypeOption = {
  id: string;
  title: string;
  description: string;
  image: number;
};

type BodyTypeCardProps = {
  item: BodyTypeOption;
  selected: boolean;
  expanded: boolean;
  onPress: () => void;
  index: number;
};

export const BodyTypeCard = React.memo(function BodyTypeCard({
  item,
  selected,
  expanded,
  onPress,
  index,
}: BodyTypeCardProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.01 : 1, {
      damping: 14,
      stiffness: 180,
    });
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.985, { damping: 14, stiffness: 220 });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(selected ? 1.01 : 1, {
      damping: 14,
      stiffness: 180,
    });
  }, [scale, selected]);

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 60)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className={`rounded-2xl border border-[#d3d3d3] bg-[#F2F4F7] ${
          selected ? "bg-[#e0e1e9]" : "border-[#BCBCBC]"
        }`}
      >
        {/* Header row */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-1 pr-4">
            <Text className="text-base font-semibold text-[#1D1A27]">
              {item.title}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-[#6B7280]">
              {item.description}
            </Text>
          </View>

          {/* Right icon */}
          <View className="h-8 w-8 items-center justify-center">
            {selected ? (
              <Check size={20} color="#1B1623" strokeWidth={2.5} />
            ) : expanded ? (
              <ChevronDown size={20} color="#9CA3AF" />
            ) : (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </View>
        </View>

        {/* Expanded image */}
        {expanded && (
          <Animated.View entering={FadeIn.duration(200)}>
            <ExpoImage
              source={item.image}
              contentFit="contain"
              cachePolicy="memory-disk"
              style={{
                height: 300,
                width: "100%",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
            />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
});
