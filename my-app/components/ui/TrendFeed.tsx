import React, { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  IconChartLine,
  IconCrown,
  IconMapPin,
  IconTrendingUp,
  IconLock,
  IconStar,
  IconFlame,
} from "@tabler/icons-react-native";
import { useRouter } from "expo-router";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TrendItem {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  trendPercent: number;
  rank: number;
  tag: string;
  tagColor: string;
  tagBg: string;
  colorTop: string;
  colorBottom: string;
  isPremium: boolean;
  emoji: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const LOCAL_TRENDS: TrendItem[] = [
  {
    id: 101,
    title: "Palazzo Pants",
    subtitle: "Trending near you",
    location: "Indore",
    trendPercent: 84,
    rank: 1,
    tag: "Casual",
    tagColor: "#10B981",
    tagBg: "#ECFDF5",
    colorTop: "#667EEA",
    colorBottom: "#764BA2",
    isPremium: false,
    emoji: "👖",
  },
  {
    id: 102,
    title: "Kurti Sets",
    subtitle: "Local favourite",
    location: "Indore",
    trendPercent: 78,
    rank: 2,
    tag: "Ethnic",
    tagColor: "#EF4444",
    tagBg: "#FEF2F2",
    colorTop: "#F093FB",
    colorBottom: "#F5576C",
    isPremium: false,
    emoji: "🎽",
  },
  {
    id: 103,
    title: "Cotton Coords",
    subtitle: "Weekend vibes",
    location: "Indore",
    trendPercent: 65,
    rank: 3,
    tag: "Comfort",
    tagColor: "#6366F1",
    tagBg: "#EEF2FF",
    colorTop: "#43E97B",
    colorBottom: "#38F9D7",
    isPremium: false,
    emoji: "👗",
  },
  {
    id: 104,
    title: "Linen Shirts",
    subtitle: "Summer essential",
    location: "Indore",
    trendPercent: 60,
    rank: 4,
    tag: "Summer",
    tagColor: "#F59E0B",
    tagBg: "#FFFBEB",
    colorTop: "#FDB99B",
    colorBottom: "#FF5F6D",
    isPremium: false,
    emoji: "👕",
  },
];

export const CELEBRITY_TRENDS: TrendItem[] = [
  {
    id: 201,
    title: "Deepika's Look",
    subtitle: "Cannes 2024 inspired",
    location: "Bollywood",
    trendPercent: 96,
    rank: 1,
    tag: "Celeb",
    tagColor: "#EC4899",
    tagBg: "#FDF2F8",
    colorTop: "#FA709A",
    colorBottom: "#FEE140",
    isPremium: true,
    emoji: "💃",
  },
  {
    id: 202,
    title: "Alia's Ethnic",
    subtitle: "Wedding season pick",
    location: "Bollywood",
    trendPercent: 88,
    rank: 2,
    tag: "Ethnic",
    tagColor: "#EF4444",
    tagBg: "#FEF2F2",
    colorTop: "#F093FB",
    colorBottom: "#F5576C",
    isPremium: true,
    emoji: "🌸",
  },
  {
    id: 203,
    title: "Ranveer Bold",
    subtitle: "Street style king",
    location: "Bollywood",
    trendPercent: 81,
    rank: 3,
    tag: "Bold",
    tagColor: "#8B5CF6",
    tagBg: "#F5F3FF",
    colorTop: "#4FACFE",
    colorBottom: "#00F2FE",
    isPremium: true,
    emoji: "🕺",
  },
  {
    id: 204,
    title: "Kiara's Glam",
    subtitle: "Red carpet queen",
    location: "Bollywood",
    trendPercent: 75,
    rank: 4,
    tag: "Glam",
    tagColor: "#F59E0B",
    tagBg: "#FFFBEB",
    colorTop: "#FDDB92",
    colorBottom: "#D1FDFF",
    isPremium: true,
    emoji: "✨",
  },
];

export const GLOBAL_TRENDS: TrendItem[] = [
  {
    id: 301,
    title: "Y2K Revival",
    subtitle: "Going viral worldwide",
    location: "Global",
    trendPercent: 92,
    rank: 1,
    tag: "Retro",
    tagColor: "#EC4899",
    tagBg: "#FDF2F8",
    colorTop: "#FA709A",
    colorBottom: "#FEE140",
    isPremium: false,
    emoji: "💫",
  },
  {
    id: 302,
    title: "Quiet Luxury",
    subtitle: "Minimalist movement",
    location: "Global",
    trendPercent: 89,
    rank: 2,
    tag: "Minimal",
    tagColor: "#6B7280",
    tagBg: "#F9FAFB",
    colorTop: "#E0EAF4",
    colorBottom: "#667EEA",
    isPremium: false,
    emoji: "🤍",
  },
  {
    id: 303,
    title: "Gorpcore",
    subtitle: "Outdoor street style",
    location: "Global",
    trendPercent: 74,
    rank: 3,
    tag: "Outdoor",
    tagColor: "#10B981",
    tagBg: "#ECFDF5",
    colorTop: "#43E97B",
    colorBottom: "#38F9D7",
    isPremium: false,
    emoji: "🏔️",
  },
  {
    id: 304,
    title: "Barbiecore",
    subtitle: "Pink is the new black",
    location: "Global",
    trendPercent: 70,
    rank: 4,
    tag: "Fun",
    tagColor: "#EC4899",
    tagBg: "#FDF2F8",
    colorTop: "#FF9A9E",
    colorBottom: "#FECFEF",
    isPremium: false,
    emoji: "💕",
  },
];

// ─── Reusable Trend Card ──────────────────────────────────────────────────────

const RANK_COLORS = ["#F59E0B", "#9B9BAF", "#CD7C46"];

export const TrendCard = React.memo(function TrendCard({
  trend,
  compact = false,
}: {
  trend: TrendItem;
  compact?: boolean;
}) {
  const rankColor = RANK_COLORS[trend.rank - 1] ?? "#E9EBF8";
  const cardWidth = compact ? 130 : 148;
  const imageHeight = compact ? 120 : 140;

  return (
    <Pressable
      style={{
        width: cardWidth,
        marginRight: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#F0EEF8",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      {/* Visual area */}
      <View
        style={{
          height: imageHeight,
          backgroundColor: trend.colorTop,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: imageHeight * 0.55,
            backgroundColor: trend.colorBottom,
            opacity: 0.55,
          }}
        />

        {/* Rank */}
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: rankColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 10, fontFamily: "TikTokSans16pt-ExtraBold", color: "#FFFFFF" }}>
            #{trend.rank}
          </Text>
        </View>

        {/* Premium lock */}
        {trend.isPremium && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: "rgba(0,0,0,0.40)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconLock size={12} color="#FFFFFF" />
          </View>
        )}

        {/* Emoji center */}
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: "rgba(255,255,255,0.22)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 27 }}>{trend.emoji}</Text>
        </View>

        {/* Trending % */}
        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            backgroundColor: "rgba(0,0,0,0.30)",
            borderRadius: 10,
            paddingHorizontal: 7,
            paddingVertical: 3,
          }}
        >
          <IconTrendingUp size={9} color="#FFFFFF" />
          <Text style={{ fontSize: 9, fontFamily: "TikTokSans16pt-Bold", color: "#FFFFFF" }}>
            {trend.trendPercent}%
          </Text>
        </View>
      </View>

      {/* Text */}
      <View style={{ padding: 11 }}>
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: trend.tagBg,
            borderRadius: 7,
            paddingHorizontal: 7,
            paddingVertical: 2,
            marginBottom: 7,
          }}
        >
          <Text
            style={{ fontSize: 8, fontFamily: "TikTokSans16pt-Bold", color: trend.tagColor }}
          >
            {trend.tag.toUpperCase()}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            fontFamily: "TikTokSans16pt-ExtraBold",
            color: "#1D1A27",
            marginBottom: 4,
          }}
        >
          {trend.title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <IconMapPin size={9} color="#9B9BAF" />
          <Text style={{ fontSize: 9, color: "#9B9BAF", fontFamily: "TikTokSans16pt-Medium" }}>
            {trend.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = React.memo(function SectionHeader({
  icon,
  label,
  subtitle,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 14,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <View>
        <Text style={{ fontSize: 16, fontFamily: "TikTokSans16pt-Bold", color: "#1D1A27" }}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "#9B9BAF",
            fontFamily: "TikTokSans16pt-Medium",
            marginTop: 1,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
});

// ─── Main TrendFeed Component (used on Home screen) ──────────────────────────

export const TrendFeed = React.memo(function TrendFeed() {
  const router = useRouter();

  const handleSeeAll = useCallback(() => {
    router.push("/(root)/trend-feed" as never);
  }, [router]);

  return (
    <View style={{ marginTop: 24, marginBottom: 80 }}>
      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontFamily: "TikTokSans16pt-ExtraBold", color: "#1D1A27" }}>
            Trend Feed
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#9B9BAF",
              fontFamily: "TikTokSans16pt-Medium",
              marginTop: 2,
            }}
          >
            Trending near you · Indore
          </Text>
        </View>

        <Pressable
          onPress={handleSeeAll}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#1D1A27",
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <IconChartLine size={12} color="#FFFFFF" />
          <Text style={{ fontSize: 12, fontFamily: "TikTokSans16pt-SemiBold", color: "#FFFFFF" }}>
            See all
          </Text>
        </Pressable>
      </View>

      {/* ── Local section label ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 20,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#EEF2FF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconMapPin size={14} color="#6366F1" />
        </View>
        <Text style={{ fontSize: 13, fontFamily: "TikTokSans16pt-SemiBold", color: "#7E7C8C" }}>
          Near You · Indore
        </Text>
      </View>

      {/* ── Local trends only ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
        style={{ marginBottom: 20 }}
      >
        {LOCAL_TRENDS.map((trend) => (
          <TrendCard key={trend.id} trend={trend} />
        ))}
      </ScrollView>

      {/* ── See all banner (celebrity + global teaser) ── */}
      <Pressable
        onPress={handleSeeAll}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginHorizontal: 20,
          backgroundColor: "#F8F7FC",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#E9EBF8",
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <View style={{ flexDirection: "row", gap: -8 }}>
          {["⭐", "🌍"].map((emoji, i) => (
            <View
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: i === 0 ? "#FDF2F8" : "#FEF2F2",
                borderWidth: 2,
                borderColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: i > 0 ? -10 : 0,
              }}
            >
              <Text style={{ fontSize: 16 }}>{emoji}</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontFamily: "TikTokSans16pt-Bold", color: "#1D1A27" }}>
            Celebrity &amp; Global Trends
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#9B9BAF",
              fontFamily: "TikTokSans16pt-Medium",
              marginTop: 2,
            }}
          >
            Tap to explore worldwide fashion
          </Text>
        </View>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#1D1A27",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconChartLine size={13} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
});
