import { ChevronDown, ChevronRight, Check } from "lucide-react-native";
import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
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

export function BodyTypeCard({
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

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 60)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.985, { damping: 14, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(selected ? 1.01 : 1, {
            damping: 14,
            stiffness: 180,
          });
        }}
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
            <Image
              source={item.image}
              resizeMode="contain"
              className="h-[300px] w-full rounded-b-2xl"
            />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}
