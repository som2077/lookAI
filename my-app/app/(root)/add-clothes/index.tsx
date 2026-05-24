import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  IconArrowLeft,
  IconCamera,
  IconChevronRight,
  IconPencil,
  IconPhoto,
} from "@tabler/icons-react-native";

interface MethodOption {
  id: "camera" | "gallery" | "manual";
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  desc: string;
}

const OPTIONS: MethodOption[] = [
  {
    id: "camera",
    Icon: IconCamera,
    title: "Take a photo",
    desc: "Use your camera to capture the item",
  },
  {
    id: "gallery",
    Icon: IconPhoto,
    title: "Choose from gallery",
    desc: "Pick an existing photo of the item",
  },
  {
    id: "manual",
    Icon: IconPencil,
    title: "Add manually",
    desc: "Enter clothing details by hand",
  },
];

export default function AddClothesIndex() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(root)/(tabs)" as never);
  }, [router]);

  const handleGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      router.push({
        pathname: "/(root)/add-clothes/scanning",
        params: { photoUri: result.assets[0].uri },
      } as never);
    }
  }, [router]);

  const handleSelect = useCallback(
    (id: MethodOption["id"]) => {
      if (id === "camera") {
        router.push("/(root)/add-clothes/camera" as never);
      } else if (id === "gallery") {
        handleGallery();
      } else {
        router.push({
          pathname: "/(root)/add-clothes/form",
          params: { mode: "manual" },
        } as never);
      }
    },
    [router, handleGallery],
  );

  return (
    <View className="flex-1 bg-[#0c0c0c]">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={handleBack}
            className="h-9 w-9 items-center justify-center rounded-xl bg-[#141414] border border-[#1e1e1e]"
          >
            <IconArrowLeft size={16} color="#ffffff" />
          </Pressable>
          <Text className="text-white text-sm font-bold">Add clothes</Text>
          <View className="w-9" />
        </View>

        <View className="flex-1 px-5 pt-4">
          <Text className="text-white text-2xl font-extrabold mb-1">
            How would you like{"\n"}to add this item?
          </Text>
          <Text className="text-[#888] text-xs mb-7">
            Pick the easiest way to capture your wardrobe item.
          </Text>

          {OPTIONS.map((opt) => {
            const Icon = opt.Icon;
            return (
              <Pressable
                key={opt.id}
                onPress={() => handleSelect(opt.id)}
                className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 mb-3 flex-row items-center gap-3"
              >
                <View className="h-12 w-12 rounded-xl bg-[#c9a84c]/15 items-center justify-center">
                  <Icon size={22} color="#c9a84c" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-bold">
                    {opt.title}
                  </Text>
                  <Text className="text-[#888] text-[11px] mt-0.5">
                    {opt.desc}
                  </Text>
                </View>
                <IconChevronRight size={18} color="#555" />
              </Pressable>
            );
          })}

          <View className="bg-[#c9a84c]/8 border border-[#c9a84c]/25 rounded-2xl p-3 mt-4">
            <Text className="text-[#c9a84c] text-[11px] font-semibold mb-1">
              Pro tip
            </Text>
            <Text className="text-[#888] text-[11px] leading-4">
              A clear photo with plain background gives the best AI detection
              for category, color, and style.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
