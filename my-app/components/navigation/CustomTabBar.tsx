import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, Pressable, View, Animated } from "react-native";
import { ReactNode, useMemo, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIcon = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: Record<string, { icon: TabIcon; label: string }> = {
  index: { icon: "home", label: "Home" },
  wardrobe: { icon: "shirt", label: "Wardrobe" },
  outfit: { icon: "grid", label: "Planner" },
  saved: { icon: "bookmark", label: "Saved" },
  profile: { icon: "person", label: "Profile" },
};

function AnimatedTabButton({
  focused,
  onPress,
  children,
  testID,
}: {
  focused: boolean;
  onPress: () => void;
  children: ReactNode;
  testID?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: focused ? 1.04 : 0.94,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }} className="items-center justify-center">
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        android_ripple={{ color: "#E5E7EB", borderless: true }}
        className="h-12 w-12 items-center justify-center"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = useMemo(() => Math.max(12, insets.bottom + 4), [insets.bottom]);

  return (
    <View pointerEvents="box-none" className="absolute inset-x-0" style={{ bottom }}>
      <View className="mx-4 flex-row items-center justify-between rounded-full bg-[#F5F5F5] px-4 py-3 shadow-lg">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key]?.options;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (route.name === "profile") {
            return (
              <AnimatedTabButton key={route.key} focused={focused} onPress={onPress} testID={options.tabBarButtonTestID}>
                <Image
                  source={require("../../assets/images/kribb.png")}
                  className="h-8 w-8 rounded-full"
                  resizeMode="cover"
                />
              </AnimatedTabButton>
            );
          }

          const config = TAB_CONFIG[route.name] ?? { icon: "ellipse" as TabIcon, label: route.name };
          const iconColor = focused ? "#111827" : "#9CA3AF";

          return (
            <AnimatedTabButton key={route.key} focused={focused} onPress={onPress} testID={options.tabBarButtonTestID}>
              <Ionicons name={config.icon} size={22} color={iconColor} />
            </AnimatedTabButton>
          );
        })}
      </View>

      <Pressable
        onPress={() => navigation.navigate("outfit")}
        className="absolute right-2 h-14 w-14 items-center justify-center rounded-full bg-[#111111]"
        style={{ bottom: 8, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 8 }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}
