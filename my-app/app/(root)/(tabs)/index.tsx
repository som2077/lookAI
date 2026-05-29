import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";
import { HomeHeader } from "../../../components/ui/HomeHeader";
import { WeeklyCalendarStrip } from "../../../components/ui/WeeklyCalendarStrip";
import type { RingProgressSegment } from "../../../components/ui/WardrobeRingSummaryCard";
import { WardrobeRingSummaryCard } from "../../../components/ui/WardrobeRingSummaryCard";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { useWardrobeSummary } from "@/backend/hooks/useWardrobeSummary";
import { OutfitAnalyzingCard } from "../../../components/ui/OutfitAnalyzingCard";
import {
  RecentlyUploadedHeading,
  NotifyBanner,
} from "../../../components/ui/RecentlyUploadedCard";
import { TrendFeed } from "../../../components/ui/TrendFeed";
import { WardrobeHighlights } from "../../../components/ui/WardrobeHighlights";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PADDING = 20;

const RING_SEGMENT_BASE: readonly Omit<RingProgressSegment, "progress">[] = [
  { id: "outer", color: "#F5B93A", radius: 58, strokeWidth: 8 },
  { id: "middle", color: "#E54B4B", radius: 48, strokeWidth: 8 },
  { id: "inner", color: "#2A78FF", radius: 38, strokeWidth: 8 },
] as const;

const clampRatio = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const CARDS = ["wardrobe", "blank1", "blank2"] as const;
type CardKey = (typeof CARDS)[number];

// Scroll distance after which header fully fades out
const FADE_DISTANCE = 90;

export default function HomeScreen() {
  const { user } = useUser();
  const { summary } = useWardrobeSummary(user?.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Animated.Value to track scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // Simple callback — sets scrollY directly, no Animated.event conflict
  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      scrollY.setValue(e.nativeEvent.contentOffset.y);
    },
    [scrollY],
  );

  // Opacity: 1 at top → 0.15 after FADE_DISTANCE px scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, FADE_DISTANCE],
    outputRange: [1, 0.15],
    extrapolate: "clamp",
  });

  // Slight upward shift as header fades
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, FADE_DISTANCE],
    outputRange: [0, -6],
    extrapolate: "clamp",
  });

  const ringSegments = useMemo<readonly RingProgressSegment[]>(() => {
    const totalTracked = summary.wearCount + summary.neverCount;
    const wearShare = totalTracked > 0 ? summary.wearCount / totalTracked : 0;
    const neverShare = totalTracked > 0 ? summary.neverCount / totalTracked : 0;
    return [
      { ...RING_SEGMENT_BASE[0], progress: clampRatio(summary.wornPercentage) },
      { ...RING_SEGMENT_BASE[1], progress: clampRatio(neverShare) },
      { ...RING_SEGMENT_BASE[2], progress: clampRatio(wearShare) },
    ];
  }, [summary]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderCard = ({ item }: { item: CardKey }) => (
    <View style={{ width: SCREEN_WIDTH, paddingHorizontal: H_PADDING }}>
      {item === "wardrobe" ? (
        <WardrobeRingSummaryCard
          wornPercentage={clampRatio(summary.wornPercentage)}
          totalWorn={summary.totalWorn}
          wearCount={summary.wearCount}
          neverCount={summary.neverCount}
          ringSegments={ringSegments}
        />
      ) : (
        <View className="bg-white shadow rounded-[20px] h-40 border border-[#E9EBF8] mt-3" />
      )}
    </View>
  );

  return (
    <SwipeTabWrapper tabIndex={0}>
      <AppGradientBackground>
        <SafeAreaView className="flex-1">
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            decelerationRate="normal"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Header & calendar — fade on scroll, runs on UI thread via native driver */}
            <Animated.View
              className="px-7"
              style={{
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              }}
            >
              <HomeHeader />
              <WeeklyCalendarStrip />
            </Animated.View>

            {/* FlatList full-width — no parent padding — pagingEnabled snaps perfectly */}
            <FlatList
              ref={flatListRef}
              data={[...CARDS] as CardKey[]}
              keyExtractor={(item) => item}
              renderItem={renderCard}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              style={{ flexGrow: 0 }}
              scrollEnabled
            />

            {/* Pagination dots */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                gap: 7,
              }}
            >
              {CARDS.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === activeIndex ? 8 : 7,
                    height: i === activeIndex ? 8 : 7,
                    borderRadius: 5,
                    backgroundColor: i === activeIndex ? "#1C1C1E" : "#C7C7C7",
                  }}
                />
              ))}
            </View>

            {/* Recently uploaded */}
            <RecentlyUploadedHeading />

            {/* Notify banner */}
            <NotifyBanner />

            {/* Analysis card */}
            <OutfitAnalyzingCard />

            {/* Wardrobe Highlights */}
            <WardrobeHighlights />

            {/* Trend Feed */}
            <TrendFeed />
          </ScrollView>
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
