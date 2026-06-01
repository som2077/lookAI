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
import {
  IconSettings,
  IconBell,
  IconUser,
  IconLock,
  IconHelp,
  IconLogout,
  IconTrash,
  IconSparkles,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";

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
  { text: "Smart Casual", type: "yellow" },
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
      "Referral code 'ZARA2026' has been copied to your clipboard!"
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => Alert.alert("Account Deleted", "Your account has been deleted.") }
      ]
    );
  }, []);

  return (
    <SwipeTabWrapper tabIndex={3}>
      <View style={{ flex: 1, backgroundColor: "#F8F7FC" }}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
          >
            {/* Header section */}
            <View style={{ paddingHorizontal: 24, paddingTop: 16, marginBottom: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 26, fontWeight: "800", color: "#1D1A27" }}>
                  Profile
                </Text>
                
                {/* Top Action Settings and Bells */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 21,
                      backgroundColor: "#FFFFFF",
                      borderWidth: 1,
                      borderColor: "#E2E2EA",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSettings size={18} color="#9B9BAF" />
                  </Pressable>
                  <Pressable
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 21,
                      backgroundColor: "#FFFFFF",
                      borderWidth: 1,
                      borderColor: "#E2E2EA",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconBell size={18} color="#9B9BAF" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Avatar Centered Bio Card */}
            <View style={{ alignItems: "center", paddingHorizontal: 24, marginBottom: 24 }}>
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "#EAE8FF",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  {user?.imageUrl ? (
                    <Image
                      source={{ uri: user.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <IconUser size={40} color="#9B9BAF" />
                  )}
                </View>

                {/* Overlapping status indicator badge at bottom right */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "#4C36F5",
                    borderWidth: 2.5,
                    borderColor: "#FFFFFF",
                  }}
                />
              </View>

              {/* User Identity */}
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#1D1A27", marginTop: 12 }}>
                {user?.fullName || "Zara Ahmed"}
              </Text>
              
              <Text style={{ fontSize: 12, color: "#9B9BAF", fontWeight: "600", marginTop: 3 }}>
                @{user?.username || "zara.looks"} · Indore
              </Text>

              {/* Style score badge */}
              <View
                style={{
                  backgroundColor: "#F4F3FF",
                  borderWidth: 1,
                  borderColor: "#EAE8FF",
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#4C36F5" }}>
                  Style Score 78 · Grade A-
                </Text>
              </View>
            </View>

            {/* Summary statistics row card */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
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
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#1D1A27" }}>48</Text>
                  <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 4, fontWeight: "600" }}>Clothes</Text>
                </View>
                
                <View style={{ width: 1, backgroundColor: "#E2E2EA" }} />

                {/* Stat 2 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#4C36F5" }}>36</Text>
                  <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 4, fontWeight: "600" }}>Outfits</Text>
                </View>

                <View style={{ width: 1, backgroundColor: "#E2E2EA" }} />

                {/* Stat 3 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#0F824A" }}>214</Text>
                  <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 4, fontWeight: "600" }}>Wears</Text>
                </View>

                <View style={{ width: 1, backgroundColor: "#E2E2EA" }} />

                {/* Stat 4 */}
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#B25E02" }}>75%</Text>
                  <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 4, fontWeight: "600" }}>Usage</Text>
                </View>
              </View>
            </View>

            {/* Body Profile section */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: "800", color: "#1D1A27" }}>
                  Body Profile
                </Text>
                <Pressable>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#4C36F5" }}>
                    Edit ✎
                  </Text>
                </Pressable>
              </View>

              {/* Grid cards */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                    <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "800", color: "#1D1A27" }}>
                      {stat.value}
                    </Text>
                    <Text style={{ fontSize: 9, color: "#9B9BAF", marginTop: 2, fontWeight: "600" }}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Style Preferences Section */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: "800", color: "#1D1A27" }}>
                  Style Preferences
                </Text>
                <Pressable>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#4C36F5" }}>
                    Edit ✎
                  </Text>
                </Pressable>
              </View>

              {/* Flow wrap layout pills */}
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {PREFERENCE_PILLS.map((pill, idx) => (
                  <PreferenceTag key={idx} text={pill.text} type={pill.type} />
                ))}
              </View>
            </View>

            {/* Invite Friends & Earn Card */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <View
                style={{
                  backgroundColor: "#F0F4FF",
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "#D3E0FF",
                  padding: 16,
                  shadowColor: "#000",
                  shadowOpacity: 0.015,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                {/* Header row */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: "#4C36F5",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <IconSparkles size={20} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "#1D1A27" }}>
                      Invite Friends & Earn
                    </Text>
                    <Text style={{ fontSize: 10, color: "#5A5A6A", marginTop: 2, fontWeight: "500" }}>
                      Share your code — both get 1 month free Pro
                    </Text>
                  </View>
                </View>

                {/* Code Copy Slot */}
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 14,
                    padding: 8,
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#D3E0FF",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 9, color: "#9B9BAF", fontWeight: "600" }}>
                      Your referral code
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#4C36F5", marginTop: 2 }}>
                      ZARA2026
                    </Text>
                  </View>
                  
                  <Pressable
                    onPress={handleCopyReferral}
                    style={{
                      backgroundColor: "#4C36F5",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
                      Copy
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Settings Card List Container */}
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
                <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 }}>
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
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#1D1A27" }}>
                      Notifications
                    </Text>
                    <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 2, fontWeight: "500" }}>
                      Daily outfit reminders
                    </Text>
                  </View>
                </Pressable>

                <View style={{ height: 1, backgroundColor: "#F1F1F5", marginHorizontal: 16 }} />

                {/* 2. Privacy */}
                <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 }}>
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
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#1D1A27" }}>
                      Privacy
                    </Text>
                    <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 2, fontWeight: "500" }}>
                      Manage your data
                    </Text>
                  </View>
                </Pressable>

                <View style={{ height: 1, backgroundColor: "#F1F1F5", marginHorizontal: 16 }} />

                {/* 3. Help & Support */}
                <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 }}>
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
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#1D1A27" }}>
                      Help & Support
                    </Text>
                    <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 2, fontWeight: "500" }}>
                      FAQs, contact us
                    </Text>
                  </View>
                </Pressable>

                <View style={{ height: 1, backgroundColor: "#F1F1F5", marginHorizontal: 16 }} />

                {/* 4. Log Out */}
                <Pressable
                  onPress={onLogoutPress}
                  disabled={isLoggingOut}
                  style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 }}
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
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#EF4444" }}>
                      Log Out
                    </Text>
                  </View>
                </Pressable>

                <View style={{ height: 1, backgroundColor: "#F1F1F5", marginHorizontal: 16 }} />

                {/* 5. Delete Account */}
                <Pressable
                  onPress={handleDeleteAccount}
                  style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 }}
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
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#EF4444" }}>
                      Delete Account
                    </Text>
                    <Text style={{ fontSize: 10, color: "#9B9BAF", marginTop: 2, fontWeight: "500" }}>
                      Permanently remove all data
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
