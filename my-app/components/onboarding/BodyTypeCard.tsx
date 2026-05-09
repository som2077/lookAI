import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type BodyTypeOption = {
  id: string;
  title: string;
  image: number;
};

type BodyTypeCardProps = {
  item: BodyTypeOption;
  selected: boolean;
  onPress: () => void;
  index: number;
};

export function BodyTypeCard({ item, selected, onPress, index }: BodyTypeCardProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.02 : 1, { damping: 14, stiffness: 180 });
  }, [scale, selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(350).delay(index * 70)} style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 16, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(selected ? 1.02 : 1, { damping: 14, stiffness: 180 });
        }}
        className={`overflow-hidden rounded-3xl border bg-white ${selected ? "border-[#1B1623] shadow-xl" : "border-[#E8E6EE]"}`}
      >
        <View className="px-5 pb-4 pt-5">
          <Text className="text-lg font-semibold text-[#1D1A27]">{item.title}</Text>
        </View>
        <Image source={item.image} resizeMode="cover" className="h-[260px] w-full" />
      </TouchableOpacity>
    </Animated.View>
  );
}
