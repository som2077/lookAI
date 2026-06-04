import { Tabs } from "expo-router";
import { CustomTabBar } from "../../../components/navigation/CustomTabBar";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const renderTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        lazy: true,
      }}
      tabBar={renderTabBar}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="wardrobe" options={{ title: "Wardrobe" }} />
      <Tabs.Screen name="outfit" options={{ href: null, title: "Planner" }} />
      <Tabs.Screen name="saved" options={{ title: "Saved" }} />
      <Tabs.Screen name="score" options={{ href: null, title: "Score" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="subscription"
        options={{ href: null, title: "Subscription" }}
      />
      <Tabs.Screen name="posts" options={{ href: null, title: "Posts" }} />
      <Tabs.Screen
        name="manage-subscription"
        options={{ href: null, title: "Manage Subscription" }}
      />
    </Tabs>
  );
}
