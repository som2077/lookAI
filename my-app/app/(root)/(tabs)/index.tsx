import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";
import { HomeHeader } from "../../../components/ui/HomeHeader";
import { WeeklyCalendarStrip } from "../../../components/ui/WeeklyCalendarStrip";
import type { RingProgressSegment } from "../../../components/ui/WardrobeRingSummaryCard";
import { WardrobeRingSummaryCard } from "../../../components/ui/WardrobeRingSummaryCard";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";

const GREETING_MESSAGE = "Good morning, Sophie! 👋" as const;
const PERIOD_LABEL = "Weekly" as const;
const WORN_PERCENTAGE = 0.75;
const TOTAL_WORN = 36 as const;
const TOTAL_WEAR_COUNT = 214 as const;
const TOTAL_NEVER_COUNT = 12 as const;

const RING_SEGMENTS: readonly RingProgressSegment[] = [
  {
    id: "outer",
    progress: 0.75,
    color: "#F5B93A",
    radius: 68,
    strokeWidth: 14,
  },
  {
    id: "middle",
    progress: 0.35,
    color: "#E54B4B",
    radius: 52,
    strokeWidth: 14,
  },
  {
    id: "inner",
    progress: 0.55,
    color: "#2A78FF",
    radius: 36,
    strokeWidth: 14,
  },
] as const;

export default function HomeScreen() {
  return (
    <SwipeTabWrapper tabIndex={0}>
      <AppGradientBackground>
        <SafeAreaView className="flex-1 px-7">
          <HomeHeader />
          <WeeklyCalendarStrip />
          <WardrobeRingSummaryCard
            greeting={GREETING_MESSAGE}
            periodLabel={PERIOD_LABEL}
            wornPercentage={WORN_PERCENTAGE}
            totalWorn={TOTAL_WORN}
            wearCount={TOTAL_WEAR_COUNT}
            neverCount={TOTAL_NEVER_COUNT}
            ringSegments={RING_SEGMENTS}
          />
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
