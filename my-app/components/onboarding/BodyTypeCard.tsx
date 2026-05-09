import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 60)} style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.985, { damping: 14, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(selected ? 1.02 : 1, { damping: 14, stiffness: 180 });
        }}
        style={{
          overflow: "hidden",
          borderRadius: 24,
          borderWidth: 1.5,
          borderColor: selected ? "#1B1623" : "#E8E6EE",
          backgroundColor: "#fff",
          shadowColor: "#1B1623",
          shadowOpacity: selected ? 0.2 : 0.05,
          shadowRadius: selected ? 12 : 6,
          shadowOffset: { width: 0, height: selected ? 6 : 3 },
          elevation: selected ? 6 : 1,
        }}
      >
        <View className="px-5 pb-4 pt-5">
          <Text className="text-lg font-semibold text-[#1D1A27]">{item.title}</Text>
        </View>
        <Image source={item.image} resizeMode="cover" className="h-[260px] w-full" />
      </Pressable>
    </Animated.View>
  );
}
