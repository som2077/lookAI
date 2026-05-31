import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  IconCrown,
  IconSettings,
  IconChartBar,
  IconHelp,
  IconLogout,
  IconChevronRight,
  IconUser,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { useBillingStore, selectIsPremium } from "@/billing/store";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { entitlement } = useBillingStore();
  const isPremium = selectIsPremium(entitlement);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogoutPress = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSubscriptionPress = useCallback(() => {
    router.push("/(root)/(tabs)/subscription" as never);
  }, [router]);

  const handleWardrobePress = useCallback(() => {
    router.push("/(root)/(tabs)/wardrobe" as never);
  }, [router]);

  return (
    <SwipeTabWrapper tabIndex={3}>
      <View style={{ flex: 1, backgroundColor: "#F8F7FC" }}>
        <StatusBar style="dark" />
        <SafeAreaView className="flex-1" edges={["top"]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#1D1A27",
                }}
              >
                Profile
              </Text>
            </View>

            {/* Profile Card Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 24,
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: "#E2E2EA",
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#E2E2EA",
                }}
              >
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <IconUser size={32} color="#9B9BAF" />
                )}
              </View>

              <View style={{ marginLeft: 16, flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "800",
                      color: "#1D1A27",
                    }}
                  >
                    {user?.fullName || "Look AI User"}
                  </Text>

                  {isPremium && (
                    <View
                      style={{
                        backgroundColor: "#8B5CF6",
                        borderRadius: 6,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        marginLeft: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "800",
                          color: "#FFFFFF",
                        }}
                      >
                        PRO
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 13,
                    color: "#9B9BAF",
                    marginTop: 3,
                  }}
                >
                  {user?.primaryEmailAddress?.emailAddress || "user@lookai.com"}
                </Text>
              </View>
            </View>

            {/* Mini Wardrobe Stats Summary */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                paddingVertical: 14,
                paddingHorizontal: 20,
                marginHorizontal: 24,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "#E9EBF8",
              }}
            >
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "800", color: "#1D1A27" }}
                >
                  48
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    color: "#9B9BAF",
                    marginTop: 2,
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Clothes
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "800", color: "#1D1A27" }}
                >
                  12
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    color: "#9B9BAF",
                    marginTop: 2,
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Unworns
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "800", color: "#1D1A27" }}
                >
                  75%
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    color: "#9B9BAF",
                    marginTop: 2,
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Usage
                </Text>
              </View>
            </View>

            {/* Settings Group Menu */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#E9EBF8",
                marginHorizontal: 24,
                paddingVertical: 8,
                shadowColor: "#000",
                shadowOpacity: 0.01,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              {/* Manage Subscription */}
              <Pressable
                onPress={handleSubscriptionPress}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#F3E8FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconCrown size={20} color="#8B5CF6" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "700", color: "#1D1A27" }}
                  >
                    Manage Subscription
                  </Text>
                  <Text style={{ fontSize: 11, color: "#9B9BAF", marginTop: 2 }}>
                    Manage premium plans and billing
                  </Text>
                </View>
                <IconChevronRight size={18} color="#C8C8D3" />
              </Pressable>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#F2F2F5",
                  marginHorizontal: 16,
                }}
              />

              {/* Wardrobe Analytics */}
              <Pressable
                onPress={handleWardrobePress}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#E8F8F0",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconChartBar size={20} color="#10B981" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "700", color: "#1D1A27" }}
                  >
                    Wardrobe Analytics
                  </Text>
                  <Text style={{ fontSize: 11, color: "#9B9BAF", marginTop: 2 }}>
                    Style stats, wears, and usage analytics
                  </Text>
                </View>
                <IconChevronRight size={18} color="#C8C8D3" />
              </Pressable>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#F2F2F5",
                  marginHorizontal: 16,
                }}
              />

              {/* Style Preferences */}
              <Pressable
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#EFF6FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSettings size={20} color="#3B82F6" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "700", color: "#1D1A27" }}
                  >
                    Style Preferences
                  </Text>
                  <Text style={{ fontSize: 11, color: "#9B9BAF", marginTop: 2 }}>
                    Personalize AI outfit generation guidelines
                  </Text>
                </View>
                <IconChevronRight size={18} color="#C8C8D3" />
              </Pressable>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#F2F2F5",
                  marginHorizontal: 16,
                }}
              />

              {/* Help & Support */}
              <Pressable
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconHelp size={20} color="#6B7280" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "700", color: "#1D1A27" }}
                  >
                    Help & Support
                  </Text>
                  <Text style={{ fontSize: 11, color: "#9B9BAF", marginTop: 2 }}>
                    FAQs, user guides, and contact support
                  </Text>
                </View>
                <IconChevronRight size={18} color="#C8C8D3" />
              </Pressable>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#F2F2F5",
                  marginHorizontal: 16,
                }}
              />

              {/* Log Out */}
              <Pressable
                onPress={onLogoutPress}
                disabled={isLoggingOut}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  opacity: pressed || isLoggingOut ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#FEF2F2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isLoggingOut ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <IconLogout size={20} color="#EF4444" />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "700", color: "#EF4444" }}
                  >
                    Log Out
                  </Text>
                  <Text style={{ fontSize: 11, color: "#FCA5A5", marginTop: 2 }}>
                    Securely sign out of your account
                  </Text>
                </View>
                <IconChevronRight size={18} color="#FEE2E2" />
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
