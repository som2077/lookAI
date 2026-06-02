import React, { useMemo, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";
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
  EmptyStyleBanner,
} from "../../../components/ui/RecentlyUploadedCard";
import { TrendFeed } from "../../../components/ui/TrendFeed";
import { WardrobeHighlights } from "../../../components/ui/WardrobeHighlights";
import { WeatherOutfitCard } from "../../../components/ui/WeatherOutfitCard";
import { AIPickOfTheDayCard } from "../../../components/ui/AIPickOfTheDayCard";
import { LookAIBanner } from "../../../components/ui/LookAIBanner";
import { WardrobeFilterTabs } from "../../../components/ui/WardrobeFilterTabs";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PADDING = 20;

// Approximate height of HomeHeader + WeeklyCalendarStrip combined
const HEADER_HEIGHT = 140;

const RING_SEGMENT_BASE: readonly Omit<RingProgressSegment, "progress">[] = [
  { id: "outer", color: "#F5B93A", radius: 78, strokeWidth: 8 },
  { id: "middle", color: "#E54B4B", radius: 68, strokeWidth: 8 },
  { id: "inner", color: "#2A78FF", radius: 58, strokeWidth: 8 },
] as const;

const clampRatio = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const CARDS = ["wardrobe", "blank1", "blank2"] as const;
type CardKey = (typeof CARDS)[number];

export default function HomeScreen() {
  const { user } = useUser();
  const { summary } = useWardrobeSummary(user?.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

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
    viewAreaCoveragePercentThreshold: 60,
    waitForInteraction: false,
  }).current;

  const renderCard = ({ item }: { item: CardKey }) => (
    <View style={{ width: SCREEN_WIDTH, paddingHorizontal: H_PADDING }}>
      {item === "wardrobe" ? (
        <>
          <WardrobeRingSummaryCard
            wornPercentage={clampRatio(summary.wornPercentage)}
            totalWorn={summary.totalWorn}
            wearCount={summary.wearCount}
            neverCount={summary.neverCount}
            ringSegments={ringSegments}
          />
          <WardrobeFilterTabs />
        </>
      ) : item === "blank1" ? (
        <>
          <WeatherOutfitCard />
          <LookAIBanner />
        </>
      ) : (
        <AIPickOfTheDayCard />
      )}
    </View>
  );

  // Header stays in place (translateY counteracts scroll), clamped to HEADER_HEIGHT
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  // Fade out header as content scrolls over it
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.6, HEADER_HEIGHT],
    outputRange: [1, 0.6, 0],
    extrapolate: "clamp",
  });

  return (
    <SwipeTabWrapper tabIndex={0}>
      <AppGradientBackground>
        <SafeAreaView className="flex-1">
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true },
            )}
            scrollEventThrottle={16}
          >
            {/* Header & calendar — parallax: stays in place, content scrolls over */}
            <Animated.View
              style={{
                paddingHorizontal: 28,
                transform: [{ translateY: headerTranslateY }],
                opacity: headerOpacity,
                zIndex: 0,
              }}
            >
              <HomeHeader />
              <WeeklyCalendarStrip />
            </Animated.View>

            {/* Scrollable content — scrolls over the header */}
            <View style={{ zIndex: 1, position: "relative" }}>
              {/* FlatList full-width — pagingEnabled snaps correctly */}
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
                      backgroundColor:
                        i === activeIndex ? "#1C1C1E" : "#C7C7C7",
                    }}
                  />
                ))}
              </View>

              <RecentlyUploadedHeading />
              <NotifyBanner />
              <EmptyStyleBanner />
              <OutfitAnalyzingCard />
              <WardrobeHighlights />
              <TrendFeed />
            </View>
          </Animated.ScrollView>
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
