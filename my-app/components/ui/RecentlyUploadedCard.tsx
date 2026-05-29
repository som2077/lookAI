import React from "react";
import { Pressable, Text, View } from "react-native";
import { IconBell, IconX } from "@tabler/icons-react-native";
import { useOutfitAnalysisStore } from "@/backend/store/outfit-analysis-store";

export const RecentlyUploadedHeading = React.memo(
  function RecentlyUploadedHeading() {
    return (
      <Text className="text-[#1D1A27] text-lg font-bold mx-8 mt-4">
        Recently Styled
      </Text>
    );
  },
);

export const NotifyBanner = React.memo(function NotifyBanner() {
  const { isAnalyzing, lastOutfits } = useOutfitAnalysisStore();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Show banner only when no analysis and no completed outfits
  if (isAnalyzing || lastOutfits.length > 0 || isDismissed) return null;

  return (
    <View
      className="mx-5 mt-2 mb-2 flex-row items-center justify-between bg-white rounded-[16px] px-4 py-4"
      style={{
        shadowColor: "#000000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View className="flex-row items-center flex-1 pr-3">
        <IconBell size={24} color="#000000" strokeWidth={1.5} />
        <Text
          className="ml-3 text-[#1D1A27]"
          style={{ fontSize: 13, lineHeight: 18, flex: 1 }}
        >
          We&apos;ll notify you when the analysis is done.
        </Text>
      </View>
      <Pressable onPress={() => setIsDismissed(true)} hitSlop={10}>
        <IconX size={20} color="#000000" strokeWidth={1.5} />
      </Pressable>
    </View>
  );
});
