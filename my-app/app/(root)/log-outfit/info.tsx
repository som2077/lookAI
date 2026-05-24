import React, { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  IconBulb,
  IconCheck,
  IconRuler2,
  IconShoe,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react-native";

interface Tip {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  desc: string;
}

const TIPS: Tip[] = [
  {
    Icon: IconUser,
    title: "Stand straight, full body",
    desc: "Make sure your head, torso, and feet are all inside the frame.",
  },
  {
    Icon: IconRuler2,
    title: "Step back ~6 feet (2 m)",
    desc: "Place the phone at chest height and step back so the full body fits.",
  },
  {
    Icon: IconSun,
    title: "Use bright, even light",
    desc: "Natural daylight or a well-lit room gives the best AI detection.",
  },
  {
    Icon: IconShoe,
    title: "Show your footwear",
    desc: "Don't crop your shoes — they count as part of your outfit.",
  },
  {
    Icon: IconBulb,
    title: "Plain background helps",
    desc: "A clean wall or door makes it easier for AI to spot your clothes.",
  },
];

const DOS = [
  "Full body — head to toe",
  "Front-facing pose",
  "Plain, well-lit background",
];

const DONTS = [
  "Cropped or zoomed-in shots",
  "Heavy shadows or backlight",
  "Multiple people in frame",
];

export default function CameraInfoScreen() {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  return (
    <View className="flex-1 bg-[#0c0c0c]">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <View className="w-9" />
          <Text className="text-white text-sm font-bold">
            How to capture your outfit
          </Text>
          <Pressable
            onPress={handleClose}
            className="h-9 w-9 items-center justify-center rounded-xl bg-[#141414] border border-[#1e1e1e]"
          >
            <IconX size={16} color="#ffffff" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
          {/* Hero */}
          <View className="bg-[#c9a84c]/10 border border-[#c9a84c]/40 rounded-2xl p-4 mb-5 flex-row items-center gap-3">
            <View className="h-11 w-11 rounded-xl bg-[#c9a84c]/20 items-center justify-center">
              <IconUser size={22} color="#c9a84c" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-bold mb-0.5">
                Full-body photo for best results
              </Text>
              <Text className="text-[#c9a84c] text-[11px]">
                AI detects your outfit head to toe — capture all of it.
              </Text>
            </View>
          </View>

          {/* Tips list */}
          <Text className="text-[#888] text-[10px] uppercase tracking-wider font-semibold mb-3">
            Tips for a great shot
          </Text>

          {TIPS.map((tip) => {
            const Icon = tip.Icon;
            return (
              <View
                key={tip.title}
                className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-3 mb-2 flex-row gap-3"
              >
                <View className="h-9 w-9 rounded-xl bg-[#1f1f1f] items-center justify-center">
                  <Icon size={18} color="#c9a84c" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-xs font-bold">
                    {tip.title}
                  </Text>
                  <Text className="text-[#888] text-[11px] mt-0.5 leading-4">
                    {tip.desc}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Do / Don't */}
          <View className="flex-row gap-2 mt-4">
            <View className="flex-1 bg-[#141414] border border-[#1D9E75]/30 rounded-2xl p-3">
              <Text className="text-[#1D9E75] text-[10px] font-bold uppercase tracking-wider mb-2">
                Do
              </Text>
              {DOS.map((d) => (
                <View key={d} className="flex-row items-start gap-1.5 mb-1.5">
                  <IconCheck size={12} color="#1D9E75" strokeWidth={3} />
                  <Text className="text-[#ddd] text-[11px] flex-1">{d}</Text>
                </View>
              ))}
            </View>
            <View className="flex-1 bg-[#141414] border border-[#ef5350]/30 rounded-2xl p-3">
              <Text className="text-[#ef5350] text-[10px] font-bold uppercase tracking-wider mb-2">
                Avoid
              </Text>
              {DONTS.map((d) => (
                <View key={d} className="flex-row items-start gap-1.5 mb-1.5">
                  <IconX size={12} color="#ef5350" strokeWidth={3} />
                  <Text className="text-[#ddd] text-[11px] flex-1">{d}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-4 pb-4 pt-2 border-t border-[#1e1e1e]">
          <Pressable
            onPress={handleClose}
            className="bg-[#c9a84c] rounded-xl py-3.5 items-center"
          >
            <Text className="text-[#1a1400] font-bold text-sm">Got it</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
