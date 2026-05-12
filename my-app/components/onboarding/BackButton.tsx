import { Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full bg-[#F2F4F7]"
    >
      <ChevronLeft size={23} color="#1D1A27" strokeWidth={2.5} />
    </Pressable>
  );
}