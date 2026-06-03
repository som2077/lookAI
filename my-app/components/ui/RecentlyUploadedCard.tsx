import React from "react";
import { Pressable, Text, View } from "react-native";
import { IconBell, IconX, IconShirt } from "@tabler/icons-react-native";
import { useOutfitAnalysisStore } from "@/backend/store/outfit-analysis-store";
// import Svg, { Polygon, Defs, LinearGradient, Stop } from "react-native-svg";

export const RecentlyUploadedHeading = React.memo(
  function RecentlyUploadedHeading() {
    return (
      <Text className="text-[#1D1A27] text-xl font-bold mx-8 mt-4">
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
      className="mx-6  mt-2 mb-2 flex-row items-center justify-between bg-white rounded-[16px] px-4 py-4"
      style={{
        shadowColor: "#000000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View className="flex-row items-center flex-1 pr-3">
        <IconBell size={23} color="#000000" strokeWidth={1.5} />
        <Text
          className="ml-3 text-[#1D1A27] font-sans"
          style={{ fontSize: 12, lineHeight: 18, flex: 1 }}
        >
          Feel free to leave this screen or use other apps.{"\n"}
          We&apos;ll send you a notification when your analysis is ready.
          {/* You can switch apps or turn off your phone.
          We&apos;ll notify you when the analysis is done. */}
        </Text>
      </View>
      <Pressable onPress={() => setIsDismissed(true)} hitSlop={10}>
        <IconX size={20} color="#000000" strokeWidth={1.5} />
      </Pressable>
    </View>
  );
});

export const EmptyStyleBanner = React.memo(function EmptyStyleBanner() {
  const { isAnalyzing, lastOutfits } = useOutfitAnalysisStore();

  // Show banner only when no analysis and no completed outfits
  if (isAnalyzing || lastOutfits.length > 0) return null;

  return (
    <View
      className="mx-6 mt-3 mb-2 items-center justify-center bg-white rounded-[16px] px-4 py-6"
      style={{
        shadowColor: "#000000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 64, height: 64, backgroundColor: "#F8F7FC" }}
      >
        <IconShirt size={30} color="#000000" strokeWidth={1.5} />
      </View>
      <Text
        className="text-[#1D1A27] mt-4 text-center font-sans"
        style={{ fontSize: 14, lineHeight: 20 }}
      >
        Tap + add you first style look of the day
      </Text>
    </View>
  );
});
