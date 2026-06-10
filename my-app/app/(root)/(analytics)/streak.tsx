import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CURRENT_STREAK_DAYS,
  LONGEST_STREAK_DAYS,
} from "@/constants/streak";
import {
  IconFlameFilled,
  IconArrowLeft,
  IconTrophy,
  IconCalendarStats,
  IconShirt,
  IconTargetArrow,
} from "@tabler/icons-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_WEEKLY: { day: string; done: boolean; today?: boolean }[] = [
  { day: "Mon", done: true },
  { day: "Tue", done: true },
  { day: "Wed", done: false },
  { day: "Thu", done: true },
  { day: "Fri", done: true },
  { day: "Sat", done: false },
  { day: "Sun", done: true, today: true },
];

const MILESTONES: { days: number; label: string; emoji: string }[] = [
  { days: 7,   label: "1 Week Fire",    emoji: "🔥" },
  { days: 30,  label: "30-Day Legend",  emoji: "⚡" },
  { days: 100, label: "Century Club",   emoji: "💎" },
  { days: 365, label: "Year Royale",    emoji: "👑" },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StreakScreen() {
  const router = useRouter();
  const currentStreak = CURRENT_STREAK_DAYS;
  const longestStreak = LONGEST_STREAK_DAYS;
  const totalOutfits = 47;
  const daysActive = 30;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <StatusBar style="dark" />

      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#F4F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconArrowLeft size={20} color="#1D1A27" />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 12,
            fontSize: 20,
            fontWeight: "800",
            color: "#1D1A27",
          }}
        >
          Streak
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >

        {/* ── Hero Flame Card ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 8,
            borderRadius: 32,
            backgroundColor: "#FF4B26",
            overflow: "hidden",
            padding: 28,
            alignItems: "center",
          }}
        >
          {/* Decorative large circle blobs */}
          <View
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 130,
              height: 130,
              borderRadius: 65,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          {/* Flame icon with glow ring */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconFlameFilled size={42} color="#FFFFFF" />
            </View>
          </View>

          {/* Day count */}
          <Text
            style={{
              fontSize: 72,
              fontWeight: "900",
              color: "#FFFFFF",
              lineHeight: 76,
            }}
          >
            {currentStreak}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "rgba(255,255,255,0.85)",
              marginTop: 4,
            }}
          >
            Day Streak 🔥
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              marginTop: 10,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            You're on fire! Log an outfit today{"\n"}to keep the streak alive.
          </Text>

          {/* CTA Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: 22,
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              paddingHorizontal: 28,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconShirt size={16} color="#FF4B26" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#FF4B26",
              }}
            >
              Log Today's Outfit
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats Row ── */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 16,
            gap: 12,
          }}
        >
          {/* Current Streak */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#F0EEF8",
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#FFF0EB",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <IconFlameFilled size={20} color="#FF4B26" />
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#1D1A27",
              }}
            >
              {currentStreak}
            </Text>
            <Text style={{ fontSize: 11, color: "#9B9BAF", fontWeight: "600", marginTop: 2 }}>
              Current
            </Text>
          </View>

          {/* Best Streak */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#F0EEF8",
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#EEF2FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <IconTrophy size={20} color="#6366F1" />
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#1D1A27",
              }}
            >
              {longestStreak}
            </Text>
            <Text style={{ fontSize: 11, color: "#9B9BAF", fontWeight: "600", marginTop: 2 }}>
              Best
            </Text>
          </View>

          {/* Total Outfits */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#F0EEF8",
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#ECFDF5",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <IconCalendarStats size={20} color="#10B981" />
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#1D1A27",
              }}
            >
              {totalOutfits}
            </Text>
            <Text style={{ fontSize: 11, color: "#9B9BAF", fontWeight: "600", marginTop: 2 }}>
              Outfits
            </Text>
          </View>
        </View>

        {/* ── This Week Activity ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            borderWidth: 1,
            borderColor: "#F0EEF8",
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1D1A27",
              }}
            >
              This Week
            </Text>
            <View
              style={{
                backgroundColor: "#FFF0EB",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#FF4B26",
                }}
              >
                5 / 7 🔥
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {MOCK_WEEKLY.map(({ day, done, today }) => (
              <View key={day} style={{ alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: today ? "#FF4B26" : "#9B9BAF",
                  }}
                >
                  {day}
                </Text>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: done
                      ? "#FF4B26"
                      : today
                      ? "#FFF0EB"
                      : "#F4F4F6",
                    borderWidth: today && !done ? 1.5 : 0,
                    borderColor: "#FF4B26",
                  }}
                >
                  {done ? (
                    <IconFlameFilled size={17} color="#FFFFFF" />
                  ) : (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: today ? "#FF4B26" : "#D1D1DB",
                      }}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Milestones ── */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1D1A27",
              }}
            >
              Milestones
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <IconTargetArrow size={14} color="#9B9BAF" />
              <Text style={{ fontSize: 12, color: "#9B9BAF", fontWeight: "600" }}>
                {MILESTONES.filter((m) => currentStreak >= m.days).length} / {MILESTONES.length} reached
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            {MILESTONES.map((m) => {
              const reached = currentStreak >= m.days;
              const progress = Math.min(currentStreak / m.days, 1);
              const barWidth = (SCREEN_WIDTH - 40 - 32) * progress;

              return (
                <View
                  key={m.days}
                  style={{
                    backgroundColor: reached ? "#FFF8F6" : "#FFFFFF",
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: reached ? "#FFD5CC" : "#F0EEF8",
                    padding: 16,
                    shadowColor: "#000",
                    shadowOpacity: 0.02,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 1,
                  }}
                >
                  {/* Top row */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: reached ? "#FF4B26" : "#F4F4F6",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                    </View>

                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: reached ? "#1D1A27" : "#9B9BAF",
                        }}
                      >
                        {m.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: reached ? "#FF7356" : "#C5C5D0",
                          marginTop: 2,
                        }}
                      >
                        {reached ? "✓ Completed" : `${m.days - currentStreak} days to go`}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: reached ? "#FF4B26" : "#C5C5D0",
                      }}
                    >
                      {m.days}d
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: "#F4F4F6",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: 6,
                        width: barWidth,
                        backgroundColor: reached ? "#FF4B26" : "#FFBEB0",
                        borderRadius: 3,
                      }}
                    />
                  </View>

                  {/* Progress label */}
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#C5C5D0",
                      fontWeight: "600",
                      marginTop: 6,
                      textAlign: "right",
                    }}
                  >
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Motivational Footer ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: "#1D1A27",
            borderRadius: 28,
            padding: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 28, marginBottom: 8 }}>✨</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            "Style is not about being noticed,{"\n"}it's about being remembered."
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              marginTop: 8,
              fontWeight: "500",
            }}
          >
            Keep logging. Keep glowing.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
