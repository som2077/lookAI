import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, Pressable, View, Animated } from "react-native";
import { ReactNode, useMemo, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIcon = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: Record<string, TabIcon> = {
  index: "home",
  wardrobe: "briefcase-outline",
  outfit: "grid-outline",
  saved: "bookmark-outline",
  profile: "person",
};

function AnimatedTabButton({ focused, onPress, children, testID }: { focused: boolean; onPress: () => void; children: ReactNode; testID?: string }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, { toValue: focused ? 1.03 : 0.95, useNativeDriver: true, speed: 24, bounciness: 7 }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 5 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        android_ripple={{ color: "#E9E9E9", borderless: true }}
        className="h-11 w-11 items-center justify-center"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = useMemo(() => Math.max(16, insets.bottom + 8), [insets.bottom]);

  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 px-3" style={{ bottom }}>
      <View className="flex-row items-center justify-between">
        <View
          className="mr-5 h-[62px] flex-1 flex-row items-center justify-between rounded-full bg-[#F5F5F5] px-4"
          style={{ shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 }}
        >
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const options = descriptors[route.key]?.options;
            const onPress = () => {
              const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            if (route.name === "profile") {
              return (
                <AnimatedTabButton key={route.key} focused={focused} onPress={onPress} testID={options.tabBarButtonTestID}>
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-[#141221]">
                    <Image source={require("../../assets/images/kribb.png")} className="h-8 w-8 rounded-full" resizeMode="cover" />
                  </View>
                </AnimatedTabButton>
              );
            }

            const icon = TAB_CONFIG[route.name] ?? "ellipse-outline";
            const iconColor = focused ? "#161421" : "#5E5D67";
            return (
              <AnimatedTabButton key={route.key} focused={focused} onPress={onPress} testID={options.tabBarButtonTestID}>
                <Ionicons name={icon} size={22} color={iconColor} />
              </AnimatedTabButton>
            );
          })}
        </View>

        <Pressable
          onPress={() => navigation.navigate("outfit")}
          className="h-[82px] w-[82px] items-center justify-center rounded-full bg-[#1A1827]"
          style={{ shadowColor: "#000", shadowOpacity: 0.24, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 10 }}
        >
          <Ionicons name="add" size={40} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
