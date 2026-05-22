import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, Pressable, View, Animated, Text } from "react-native";
import React, { ReactNode, useMemo, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IconSmartHome,
  IconHanger,
  IconBookmark,
  IconPlus,
  type IconProps,
} from "@tabler/icons-react-native";

type TabIconComponent = React.ComponentType<IconProps>;
type TabConfig = Record<string, TabIconComponent>;

const TAB_CONFIG: TabConfig = {
  index: IconSmartHome,
  wardrobe: IconHanger,
  saved: IconBookmark,
};

function AnimatedTabButton({
  focused,
  onPress,
  children,
  label,
  testID,
}: {
  focused: boolean;
  onPress: () => void;
  children: ReactNode;
  label?: string;
  testID?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 24,
      bounciness: 7,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 5,
    }).start();
  };

  return (
    // flex:1 rakhein taaki tabs equally spaced rahein,
    // lekin alignItems:"center" se inner content shrink ho
    <Animated.View
      style={{ transform: [{ scale }], flex: 1, alignItems: "center" }}
    >
      <View style={{ borderRadius: 999, overflow: "hidden", width: "100%" }}>
        <Pressable
          testID={testID}
          onPress={onPress}
          onPressIn={animateIn}
          onPressOut={animateOut}
          android_ripple={{ color: "#E9E9E9", borderless: false }}
          style={{ alignItems: "center", width: "100%" }}
        >
          <View
            style={[
              {
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                paddingHorizontal: 8,
                paddingVertical: 6,
                backgroundColor: focused ? "#F2F2F2" : "transparent",
              },
              focused
                ? {
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 4,
                  }
                : undefined,
            ]}
          >
            {children}
            {label ? (
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 8,
                  fontWeight: focused ? "600" : "400",
                  color: focused ? "#161421" : "#9898A6",
                }}
              >
                {label}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = useMemo(
    () => Math.max(16, insets.bottom + 8),
    [insets.bottom],
  );

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Main Tab Bar Pill */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 999,
            backgroundColor: "#Ffffff",
            paddingHorizontal: 7,
            paddingVertical: 8,
            height: 60,
            shadowColor: "#000000",
            shadowOpacity: 0.12,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 6 },
            elevation: 16,
          }}
        >
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

            const label = options?.title ?? route.name;

            // Profile tab — avatar icon
            if (route.name === "profile") {
              return (
                <AnimatedTabButton
                  key={route.key}
                  focused={focused}
                  onPress={onPress}
                  label={label}
                  testID={options?.tabBarButtonTestID}
                >
                  <View
                    style={[
                      {
                        height: 28,
                        width: 28,
                        borderRadius: 14,
                        overflow: "hidden",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                      {
                        borderWidth: 14,
                        borderColor: focused ? "#5ECFC2" : "#C8C8D0",
                      },
                    ]}
                  >
                    <Image
                      source={require("../../assets/images/kribb.png")}
                      style={{ height: 28, width: 28, borderRadius: 14 }}
                      resizeMode="cover"
                    />
                  </View>
                </AnimatedTabButton>
              );
            }

            const IconComponent = TAB_CONFIG[route.name];
            const iconColor = focused ? "#161421" : "#9898A6";
            if (!IconComponent) return null;

            return (
              <AnimatedTabButton
                key={route.key}
                focused={focused}
                onPress={onPress}
                label={label}
                testID={options?.tabBarButtonTestID}
              >
                <IconComponent size={25} color={iconColor} strokeWidth={1.5} />
              </AnimatedTabButton>
            );
          })}
        </View>

        {/* Plus / Add Button */}
        <Pressable
          onPress={() => navigation.navigate("outfit")}
          style={{
            marginLeft: 12,
            height: 60,
            width: 60,
            borderRadius: 30,
            backgroundColor: "#1A1827",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#1A1827",
            shadowOpacity: 0.35,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
            elevation: 12,
          }}
        >
          <IconPlus size={30} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
