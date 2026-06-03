import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useState, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  IconSettings,
  IconBell,
  IconUser,
  IconLock,
  IconHelp,
  IconLogout,
  IconTrash,
  IconSparkles,
  IconChevronRight,
  IconArrowLeft,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import Svg, { Circle } from "react-native-svg";

// ─── Constants & Types ────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 8;
const PADDING = 24;
const BODY_CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - CARD_GAP * 3) / 4;

interface PreferencePill {
  text: string;
  type: "purple" | "green" | "yellow" | "pink" | "blue";
}

const PREFERENCE_PILLS: PreferencePill[] = [
  { text: "Minimal", type: "purple" },
  { text: "Casual", type: "green" },
  { text: "Formal", type: "pink" },
  { text: "Streetwear", type: "blue" },
];

interface BodyStat {
  emoji: string;
  value: string;
  label: string;
}

const BODY_STATS: BodyStat[] = [
  { emoji: "📏", value: "5'9\"", label: "Height" },
  { emoji: "👤", value: "Slim", label: "Body Type" },
  { emoji: "🎨", value: "Medium", label: "Skin Tone" },
  { emoji: "🎂", value: "24", label: "Age" },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

const PreferenceTag = React.memo(function PreferenceTag({
  text,
  type,
}: PreferencePill) {
  const styles = useMemo(() => {
    switch (type) {
      case "purple":
        return { bg: "#F4F3FF", border: "#E5DAFB", text: "#6538C9" };
      case "green":
        return { bg: "#E8F8F0", border: "#C6EFD9", text: "#0F824A" };
      case "yellow":
        return { bg: "#FEF6EC", border: "#FFE6C7", text: "#B25E02" };
      case "pink":
        return { bg: "#FFF0F6", border: "#FFD6E8", text: "#C11574" };
      case "blue":
        return { bg: "#EFF8FF", border: "#CBE4FF", text: "#1665D8" };
    }
  }, [type]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: styles.bg,
        borderWidth: 1,
        borderColor: styles.border,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <IconSparkles size={10} color={styles.text} fill={styles.text} />
      <Text style={{ fontSize: 11, fontWeight: "700", color: styles.text }}>
        {text}
      </Text>
    </View>
  );
});

const MiniProgressCircle = React.memo(function MiniProgressCircle({
  score,
  size = 54,
  strokeWidth = 5,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EAE8FF"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4C36F5"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#1D1A27" }}>
          {score}
        </Text>
        <Text
          style={{
            fontSize: 7,
            color: "#9B9BAF",
            fontWeight: "600",
            marginTop: 0.5,
          }}
        >
          /100
        </Text>
      </View>
    </View>
  );
});

// ─── Main Profile Screen ───────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogoutPress = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCopyReferral = useCallback(() => {
    Alert.alert(
      "Referral Copied",
      "Referral code 'ZARA2026' has been copied to your clipboard!",
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            Alert.alert("Account Deleted", "Your account has been deleted."),
        },
      ],
    );
  }, []);

  return (
    <SwipeTabWrapper tabIndex={3}>
      <View style={{ flex: 1, backgroundColor: "#F8F7FC" }}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }} edges={[]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
          >
            {/* Gradient Header Banner */}
            <LinearGradient
              colors={["#E1EBFE", "#EAE3FC", "#FFF4DF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 110,
                width: "100%",
                paddingHorizontal: 24,
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Floating top buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <Pressable
                  onPress={() => router.back()}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: "#FFFFFFEE",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <IconArrowLeft size={18} color="#1D1A27" />
                </Pressable>

                <Pressable
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: "#FFFFFFEE",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <IconSettings size={18} color="#1D1A27" />
                </Pressable>
              </View>
            </LinearGradient>

            {/* Overlapping Avatar and Bio Action Row */}
            <View
              style={{
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <View style={{ position: "relative", marginTop: -38 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "#EAE8FF",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 3,
                    borderColor: "#FFFFFF",
                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  {user?.imageUrl ? (
                    <Image
                      source={{ uri: user.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <IconUser size={34} color="#9B9BAF" />
                  )}
                </View>

                {/* Overlapping status badge */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "#4C36F5",
                    borderWidth: 2.5,
                    borderColor: "#FFFFFF",
                  }}
                />
              </View>

              {/* Share & Edit Profile buttons row next to avatar */}
              <View style={{ flexDirection: "row", gap: 8, paddingBottom: 4 }}>
                <Pressable
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#E2E2EA",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#5A5A6A",
                    }}
                  >
                    Share
                  </Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "#4C36F5",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Edit Profile
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Left-aligned Bio Slogans */}
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
              <Text
                style={{ fontSize: 22, fontWeight: "800", color: "#1D1A27" }}
              >
                {user?.fullName || "Zara Ahmed"}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#9B9BAF",
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                @{user?.username || "zara.looks"} · Indore 📍
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: "#5A5A6A",
                  marginTop: 8,
                  lineHeight: 18,
                  fontWeight: "500",
                }}
              >
                Fashion lover 👗 Dressing for my vibe, not the crowd.
              </Text>

              {/* Preferences Tag Flow (left aligned) */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 12,
                }}
              >
                {PREFERENCE_PILLS.map((pill, idx) => (
                  <PreferenceTag key={idx} text={pill.text} type={pill.type} />
                ))}
              </View>
            </View>

            {/* Summary statistics row card */}
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 22,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: "#E2E2EA",
                  shadowColor: "#000",
                  shadowOpacity: 0.015,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                {/* Stat 1 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#1D1A27",
                    }}
                  >
                    48
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9B9BAF",
                      marginTop: 4,
                      fontWeight: "600",
                    }}
                  >
                    Clothes
                  </Text>
                </View>

                <View style={{ width: 1, backgroundColor: "#E2E2EA" }} />

                {/* Stat 2 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#4C36F5",
                    }}
                  >
                    36
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9B9BAF",
                      marginTop: 4,
                      fontWeight: "600",
                    }}
                  >
                    Outfits
                  </Text>
                </View>

                <View style={{ width: 1, backgroundColor: "#E2E2EA" }} />

                {/* Stat 3 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#0F824A",
                    }}
                  >
                    214
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9B9BAF",
                      marginTop: 4,
                      fontWeight: "600",
                    }}
                  >
                    Wears
                  </Text>
                </View>

                <View style={{ width: 1, backgroundColor: "#E2E2EA" }} />

                {/* Stat 4 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#B25E02",
                    }}
                  >
                    75%
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9B9BAF",
                      marginTop: 4,
                      fontWeight: "600",
                    }}
                  >
                    Usage
                  </Text>
                </View>
              </View>
            </View>

            {/* Clickable Style Score Card */}
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
              <Pressable
                onPress={() => router.push("/(root)/(tabs)/score" as never)}
                style={({ pressed }) => ({
                  backgroundColor: "#FFFFFF",
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "#EAE8FF",
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: pressed ? 0.01 : 0.015,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                {/* SVG Mini Progress Circle */}
                <MiniProgressCircle score={78} />

                {/* Center text block */}
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={{ flexDirection: "row", marginBottom: 3 }}>
                    <View
                      style={{
                        backgroundColor: "#E8F8F0",
                        borderWidth: 0.8,
                        borderColor: "#C6EFD9",
                        borderRadius: 8,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "800",
                          color: "#0F824A",
                        }}
                      >
                        Grade A-
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: "#1D1A27",
                    }}
                  >
                    Great Dresser!
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9B9BAF",
                      marginTop: 2,
                      fontWeight: "500",
                    }}
                  >
                    +6 pts this week · See full score
                  </Text>
                </View>

                {/* Right chevron */}
                <IconChevronRight size={18} color="#C8C8D3" />
              </Pressable>
            </View>

            {/* Body Profile Grid Cards (Rendered directly, no title header) */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {BODY_STATS.map((stat, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: BODY_CARD_WIDTH,
                      height: 100,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: "#E2E2EA",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.01,
                      shadowRadius: 3,
                      shadowOffset: { width: 0, height: 1 },
                      elevation: 1,
                    }}
                  >
                    <Text style={{ fontSize: 18, marginBottom: 6 }}>
                      {stat.emoji}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        fontWeight: "800",
                        color: "#1D1A27",
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#9B9BAF",
                        marginTop: 2,
                        fontWeight: "600",
                      }}
                    >
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Invite Friends & Earn Card (Solid blue bg banner) */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <View
                style={{
                  backgroundColor: "#4C36F5",
                  borderRadius: 24,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                {/* Header row */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: "#FFFFFF30",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <IconSparkles size={20} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: "#FFFFFF",
                      }}
                    >
                      Invite Friends & Earn
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#E0DBFF",
                        marginTop: 2,
                        fontWeight: "600",
                      }}
                    >
                      Both get 1 month free Pro 🎁
                    </Text>
                  </View>
                </View>

                {/* Code Copy Slot */}
                <View
                  style={{
                    backgroundColor: "#FFFFFF15",
                    borderRadius: 14,
                    padding: 8,
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#FFFFFF25",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#C3BCFF",
                        fontWeight: "600",
                      }}
                    >
                      Your referral code
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: "#FFFFFF",
                        marginTop: 2,
                      }}
                    >
                      ZARA2026
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleCopyReferral}
                    style={{
                      backgroundColor: "#FFFFFF",
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#4C36F5",
                      }}
                    >
                      Copy Code
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Settings Card List Container (All rows contain chevrons) */}
            <View style={{ paddingHorizontal: 24 }}>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "#E2E2EA",
                  paddingVertical: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.015,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                {/* 1. Notifications */}
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: "#F0EEFF",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <IconBell size={18} color="#4C36F5" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#1D1A27",
                      }}
                    >
                      Notifications
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#9B9BAF",
                        marginTop: 2,
                        fontWeight: "500",
                      }}
                    >
                      Daily outfit reminders
                    </Text>
                  </View>
                  <IconChevronRight size={16} color="#C8C8D3" />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F1F1F5",
                    marginHorizontal: 16,
                  }}
                />

                {/* 2. Privacy & Security */}
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: "#FFF9EE",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <IconLock size={18} color="#B25E02" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#1D1A27",
                      }}
                    >
                      Privacy & Security
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#9B9BAF",
                        marginTop: 2,
                        fontWeight: "500",
                      }}
                    >
                      Manage your data
                    </Text>
                  </View>
                  <IconChevronRight size={16} color="#C8C8D3" />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F1F1F5",
                    marginHorizontal: 16,
                  }}
                />

                {/* 3. Help & Support */}
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: "#EAF9F1",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <IconHelp size={18} color="#0F824A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#1D1A27",
                      }}
                    >
                      Help & Support
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#9B9BAF",
                        marginTop: 2,
                        fontWeight: "500",
                      }}
                    >
                      FAQs · Contact us
                    </Text>
                  </View>
                  <IconChevronRight size={16} color="#C8C8D3" />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F1F1F5",
                    marginHorizontal: 16,
                  }}
                />

                {/* 4. Log Out */}
                <Pressable
                  onPress={onLogoutPress}
                  disabled={isLoggingOut}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: "#FFF0F0",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    {isLoggingOut ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <IconLogout size={18} color="#EF4444" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#EF4444",
                      }}
                    >
                      Log Out
                    </Text>
                  </View>
                  <IconChevronRight size={16} color="#C8C8D3" />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F1F1F5",
                    marginHorizontal: 16,
                  }}
                />

                {/* 5. Delete Account */}
                <Pressable
                  onPress={handleDeleteAccount}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: "#FFF0F0",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <IconTrash size={18} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#EF4444",
                      }}
                    >
                      Delete Account
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#9B9BAF",
                        marginTop: 2,
                        fontWeight: "500",
                      }}
                    >
                      Permanently remove all data
                    </Text>
                  </View>
                  <IconChevronRight size={16} color="#C8C8D3" />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
