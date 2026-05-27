import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import {
  LastOutfit,
  useOutfitAnalysisStore,
} from "@/backend/store/outfit-analysis-store";

const MOCK_NAME = "Breezy office look";
const MOCK_SUBTITLE = "Kurta · Palazzo · Flats";
const MOCK_TAGS = ["Office", "Casual"];

const CARD_H_MARGIN = 20; // mx-6 = 6 * 4
const CARD_WIDTH = Dimensions.get("window").width - CARD_H_MARGIN * 2;

// ─── Component 1: section heading ────────────────────────────────────────────

export const RecentlyUploadedHeading = React.memo(
  function RecentlyUploadedHeading() {
    return (
      <Text className="text-[#1D1A27] text-lg font-bold mx-8 mt-4">
        Recently Styled
      </Text>
    );
  },
);

// ─── Component 2: outfit detail card (carousel + dots) ───────────────────────

interface CardItemProps {
  item: LastOutfit;
  index: number;
  onWearIt: (index: number) => void;
}

function CardItem({ item, index, onWearIt }: CardItemProps) {
  return (
    <View style={{ width: CARD_WIDTH }}>
      <View
        className="flex-row rounded-3xl border border-[#E9EBF8] bg-white overflow-hidden h-40"
        style={{
          shadowColor: "#000000",
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        {/* Left panel: outfit photo */}
        <View
          className="justify-center items-center"
          style={{ width: 115, height: 160, backgroundColor: "#C8C7C6" }}
        >
          <ExpoImage
            source={{ uri: item.imageUri }}
            style={{ width: 120, height: 100, minHeight: 160 }}
            cachePolicy="memory"
          />
        </View>

        {/* Right panel: details + buttons */}
        <View
          className="flex-1 justify-between"
          style={{ backgroundColor: "#ffffff" }}
        >
          <View className="px-2 pt-2 pb-1 ml-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className="text-[#1D1A27] font-bold flex-1 mr-2"
                style={{ fontSize: 15 }}
                numberOfLines={1}
              >
                {MOCK_NAME}
              </Text>
              <Text className="text-[#9B9BAF] text-[11px] mt-1 mr-2">
                {item.time}
              </Text>
            </View>

            <Text className="text-[#9B9BAF] text-[11px] mb-3 mt-1">
              {MOCK_SUBTITLE}
            </Text>

            <View className="flex-row flex-wrap gap-[6px]">
              {MOCK_TAGS.map((tag) => (
                <View
                  key={tag}
                  className="rounded-full px-3 py-[3px]"
                  style={{
                    borderWidth: 1,
                    borderColor: "#E9EBF8",
                    backgroundColor: "#F8F7FC",
                  }}
                >
                  <Text className="text-[#4A4A55] text-[11px] font-medium">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="flex-row gap-1 px-2 pb-2 ml-1 mr-1 mb-1">
            <Pressable className="flex-1 bg-[#1D1A27] rounded-full py-[13px] items-center">
              <Text className="text-white font-bold text-[10px]">
                View Details
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-[#1D1A27] rounded-full py-[13px] items-center"
              onPress={() => onWearIt(index)}
            >
              <Text className="text-white font-bold text-[10px]">Wear it</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export const OutfitPreviewCard = React.memo(function OutfitPreviewCard() {
  const { lastOutfits, removeOutfit } = useOutfitAnalysisStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<LastOutfit>>(null);

  useEffect(() => {
    if (lastOutfits.length > 0) {
      setActiveIndex((prev) => Math.min(prev, lastOutfits.length - 1));
    }
  }, [lastOutfits.length]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  if (lastOutfits.length === 0) {
    return (
      <View
        className="mx-5 mt-2 mb-2 flex-row rounded-3xl border border-[#E9EBF8] bg-white overflow-hidden h-40"
        style={{
          shadowColor: "#000000",
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }}
      >
        <View
          className="justify-center items-center"
          style={{ width: 115, height: 160, backgroundColor: "#F0F0F2" }}
        >
          <View className="h-[10px] rounded-full bg-[#DCDCDF] w-3/5 mb-2" />
          <View className="h-[10px] rounded-full bg-[#DCDCDF] w-2/5" />
        </View>
        <View className="flex-1 justify-center px-4 gap-[10px]">
          <View className="h-[10px] rounded-full bg-[#EBEBEB] w-3/4" />
          <View className="h-[10px] rounded-full bg-[#EBEBEB] w-1/2" />
          <View className="h-[10px] rounded-full bg-[#EBEBEB] w-2/3" />
          <Text className="text-[#BBBBC8] mt-1" style={{ fontSize: 11 }}>
            No outfits scanned yet
          </Text>
        </View>
      </View>
    );
  }

  const safeIndex = Math.min(activeIndex, lastOutfits.length - 1);

  return (
    <View className="mt-2 mb-2">
      {/* Horizontal carousel */}
      <FlatList
        ref={flatListRef}
        data={lastOutfits}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <CardItem item={item} index={index} onWearIt={removeOutfit} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={{ flexGrow: 0, marginHorizontal: CARD_H_MARGIN }}
      />

      {/* Pagination dots — only when more than 1 outfit */}
      {lastOutfits.length > 1 && (
        <View className="flex-row justify-center items-center mt-2 gap-[5px]">
          {lastOutfits.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === safeIndex ? 8 : 6,
                height: i === safeIndex ? 8 : 6,
                borderRadius: 5,
                backgroundColor: i === safeIndex ? "#1C1C1E" : "#C7C7C7",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
});
