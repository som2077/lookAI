import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  IconBell,
  IconChevronRight,
  IconLogout,
  IconMail,
  IconNotes,
  IconSettings,
  IconShield,
  IconSparkles,
  IconSpeakerphone,
  IconUser,
  IconUserMinus,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";

// ─── Sub-Components ──────────────────────────────────────────────────────────

const SectionTitle = ({ title }: { title: string }) => (
  <Text
    style={{
      fontSize: 16,
      fontWeight: "500",
      color: "#1D1D1D",
      marginBottom: 12,
      marginTop: 24,
    }}
  >
    {title}
  </Text>
);

const CardContainer = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => (
  <View
    style={[
      {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        borderColor: "#E5E7EB",
        borderWidth: 1,
      },
      style,
    ]}
  >
    {children}
  </View>
);

const ListItem = ({
  icon,
  title,
  onPress,
  hasBorder = true,
  rightElement,
}: {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  hasBorder?: boolean;
  rightElement?: React.ReactNode;
}) => (
  <>
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ marginRight: 12 }}>{icon}</View>
      <Text
        style={{ flex: 1, fontSize: 14, color: "#1D1D1D", fontWeight: "400" }}
      >
        {title}
      </Text>
      {rightElement || <IconChevronRight size={18} color="#1D1D1D" />}
    </Pressable>
    {hasBorder && (
      <View
        style={{
          height: 1,
          backgroundColor: "#E5E7EB",
          marginHorizontal: 16,
        }}
      />
    )}
  </>
);

// ─── Main Profile Screen ───────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const onLogoutPress = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account?",
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
  };

  return (
    <SwipeTabWrapper tabIndex={3}>
      <AppGradientBackground>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 116,
              paddingTop: 10,
            }}
          >
            {/* Header */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "500",
                color: "#1D1D1D",
                marginBottom: 10,
              }}
            >
              Profile
            </Text>

            {/* Profile Info Card */}
            <CardContainer>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  borderWidth: 1,
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 25,
                    backgroundColor: "#D1D5DB",
                    marginRight: 16,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#1D1D1D",
                    }}
                  >
                    {user?.fullName || "Melody Mark"}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}
                  >
                    25 Years old
                  </Text>
                </View>
                <IconChevronRight size={18} color="#1D1D1D" />
              </Pressable>
            </CardContainer>

            {/* Unlock Pro Card */}
            <CardContainer style={{ marginTop: 10 }}>
              <View
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IconSparkles size={18} color="#1D1D1D" />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: "#1D1D1D",
                    marginLeft: 8,
                  }}
                >
                  Unlock Pro
                </Text>
              </View>
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  style={{
                    height: 120,
                    borderRadius: 20,
                    overflow: "hidden",
                    justifyContent: "center",
                    padding: 16,
                  }}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: "rgba(0,0,0,0.25)",
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "700",
                      marginBottom: 12,
                      // marginTop: -30,
                    }}
                  >
                    Advanced outfit analysis.
                  </Text>
                  <Pressable
                    style={{
                      backgroundColor: "white",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 16,
                      alignSelf: "flex-start",
                      marginTop: "auto",
                    }}
                  >
                    <Text
                      style={{
                        color: "#1D1D1D",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Upgrade Now
                    </Text>
                  </Pressable>
                </ImageBackground>
              </View>
            </CardContainer>

            {/* Account Section */}
            <SectionTitle title="Account" />
            <CardContainer>
              <ListItem
                icon={<IconUser size={18} color="#1D1D1D" />}
                title="Personal details"
              />
              <ListItem
                icon={<IconSettings size={18} color="#1D1D1D" />}
                title="Preferences"
              />
              <ListItem
                icon={<IconBell size={18} color="#1D1D1D" />}
                title="Notification"
                hasBorder={false}
                rightElement={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#D1D5DB", true: "#1D1D1D" }}
                    thumbColor={"#FFFFFF"}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                }
              />
            </CardContainer>

            {/* Support & Legal Section */}
            <SectionTitle title="Support & Legal" />
            <CardContainer>
              <ListItem
                icon={<IconSpeakerphone size={18} color="#1D1D1D" />}
                title="Request a feature"
              />
              <ListItem
                icon={<IconMail size={18} color="#1D1D1D" />}
                title="Support Email"
              />
              <ListItem
                icon={<IconNotes size={18} color="#1D1D1D" />}
                title="Terms and Conditions"
              />
              <ListItem
                icon={<IconShield size={18} color="#1D1D1D" />}
                title="Privacy policy"
                hasBorder={false}
              />
            </CardContainer>

            {/* Account Action Section */}
            <SectionTitle title="Account Action" />
            <CardContainer>
              <ListItem
                icon={<IconUserMinus size={18} color="#1D1D1D" />}
                title="Delete account"
                onPress={handleDeleteAccount}
              />
              <ListItem
                icon={
                  isLoggingOut ? (
                    <ActivityIndicator size="small" color="#1D1D1D" />
                  ) : (
                    <IconLogout size={18} color="#1D1D1D" />
                  )
                }
                title="Logout"
                onPress={onLogoutPress}
                hasBorder={false}
              />
            </CardContainer>
          </ScrollView>
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
