import { View } from "react-native";

export function ProgressIndicator({ step }: { step: number }) {
  return (
    <View className="mb-4 flex-row gap-2">
      {[1, 2, 3, 4, 5, 6, 7].map((value) => (
        <View key={value} className={`h-1 flex-1 rounded-full ${value <= step ? "bg-[#1A1827]" : "bg-gray-200"}`} />
      ))}
    </View>
  );
}
