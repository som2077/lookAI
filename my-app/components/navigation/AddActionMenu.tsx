import { View, Text, Pressable, Modal, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  IconCamera,
  IconHanger,
  IconSparkles,
  IconTrendingUp,
  IconX,
  type IconProps,
} from "@tabler/icons-react-native";

interface ActionCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<IconProps>;
  route: string;
  color: string;
}

const ACTION_CARDS: ActionCard[] = [
  {
    id: "log-outfit",
    title: "Log outfit",
    subtitle: "Capture today's look",
    icon: IconCamera,
    route: "/(root)/(tabs)/outfit",
    color: "#5ECFC2",
  },
  {
    id: "add-cloths",
    title: "Add cloths",
    subtitle: "New items to wardrobe",
    icon: IconHanger,
    route: "/(root)/(tabs)/wardrobe",
    color: "#FF6B6B",
  },
  {
    id: "ai-outfit",
    title: "AI outfit",
    subtitle: "Generate my mood",
    icon: IconSparkles,
    route: "/(root)/(tabs)/outfit",
    color: "#A78BFA",
  },
  {
    id: "style-score",
    title: "Style score",
    subtitle: "Face + outfit match",
    icon: IconTrendingUp,
    route: "/(root)/(tabs)/outfit",
    color: "#FBBF24",
  },
];

interface AddActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export function AddActionMenu({
  visible,
  onClose,
  onNavigate,
}: AddActionMenuProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 15,
          bounciness: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleCardPress = (route: string) => {
    onClose();
    setTimeout(() => {
      onNavigate(route);
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
        <BlurView intensity={135} tint="dark" className="absolute inset-0" />
        <Animated.View
          className="flex-1 px-[16px] mb-[-8px] justify-end"
          style={{
            transform: [{ scale: scaleAnim }],
            paddingBottom: Math.max(24, insets.bottom + 16),
          }}
        >
          <Text className="text-[#ffffff] text-3xl font-bold text-center mb-8">
            what would you like to do?
          </Text>

          <View className="flex-row flex-wrap justify-between mb-6">
            {ACTION_CARDS.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Pressable
                  key={card.id}
                  onPress={() => handleCardPress(card.route)}
                  className="w-[48%] aspect-square rounded-2xl bg-[#ffffff] mb-4 overflow-hidden"
                >
                  <View className="flex-1 p-4 justify-between">
                    <View className="w-14 h-14 rounded-xl bg-[#b29090] items-center justify-center">
                      <IconComponent
                        size={24}
                        color={card.color}
                        strokeWidth={1.8}
                      />
                    </View>

                    <View>
                      <Text className="text-[#000000] text-base font-semibold mb-0.5">
                        {card.title}
                      </Text>
                      <Text className="text-[#000000] text-xs">
                        {card.subtitle}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onClose}
            className="self-end rounded-full bg-white items-center justify-center"
            style={{
              marginLeft: 12,
              height: 60,
              width: 60,
            }}
          >
            <IconX size={24} color="#000000" strokeWidth={2} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
