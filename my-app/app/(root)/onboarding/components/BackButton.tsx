import { Pressable, Text } from "react-native";

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="mb-3 h-9 w-9 items-start justify-center">
      <Text className="text-3xl text-[#1D1A27]">‹</Text>
    </Pressable>
  );
}
