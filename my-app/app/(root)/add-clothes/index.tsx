import React, { useCallback, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  IconArrowLeft,
  IconCamera,
  IconPencil,
  IconPhoto,
  IconSparkles,
  IconX,
} from "@tabler/icons-react-native";

export default function AddClothesIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetRendered, setSheetRendered] = useState(false);

  const sheetY = useSharedValue(300);
  const sheetOpacity = useSharedValue(0);

  const openSheet = useCallback(() => {
    setSheetRendered(true);
    sheetY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    sheetOpacity.value = withTiming(1, { duration: 220 });
  }, [sheetY, sheetOpacity]);

  const closeSheet = useCallback(() => {
    sheetY.value = withTiming(300, {
      duration: 240,
      easing: Easing.in(Easing.quad),
    });
    sheetOpacity.value = withTiming(0, { duration: 220 }, (done) => {
      if (done) runOnJS(setSheetRendered)(false);
    });
  }, [sheetY, sheetOpacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: sheetOpacity.value,
  }));

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(root)/(tabs)" as never);
  }, [router]);

  const handleGallery = useCallback(async () => {
    closeSheet();
    setTimeout(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        router.push({
          pathname: "/(root)/add-clothes/scanning",
          params: { photoUri: result.assets[0].uri },
        } as never);
      }
    }, 280);
  }, [router, closeSheet]);

  const handleCamera = useCallback(() => {
    closeSheet();
    setTimeout(() => {
      router.push("/(root)/add-clothes/camera" as never);
    }, 280);
  }, [router, closeSheet]);

  const handleManual = useCallback(() => {
    router.push({
      pathname: "/(root)/add-clothes/form",
      params: { mode: "manual" },
    } as never);
  }, [router]);

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
            Scan with AI or fill it in yourself — your choice.
          </Text>

          {/* Option 1 — Scan */}
          <Pressable
            onPress={openSheet}
            className="bg-[#141414] border border-[#1e1e1e] rounded-3xl p-5 mb-4 overflow-hidden"
          >
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 rounded-2xl bg-[#534AB7]/15 items-center justify-center">
                <IconCamera size={26} color="#8b82ff" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Text className="text-white text-base font-bold">
                    Take a photo / Gallery
                  </Text>
                </View>
                <Text className="text-[#888] text-[11px]">
                  Capture or pick an image — AI will detect category, color
                  &amp; style
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2 mt-4">
              <View className="flex-row items-center gap-1 bg-[#534AB7]/10 border border-[#534AB7]/25 rounded-full px-2.5 py-1">
                <IconSparkles size={10} color="#8b82ff" />
                <Text className="text-[#8b82ff] text-[10px] font-semibold">
                  AI scan
                </Text>
              </View>
              <View className="flex-row items-center gap-1 bg-[#1e1e1e] rounded-full px-2.5 py-1">
                <IconCamera size={10} color="#888" />
                <Text className="text-[#888] text-[10px]">Camera</Text>
              </View>
              <View className="flex-row items-center gap-1 bg-[#1e1e1e] rounded-full px-2.5 py-1">
                <IconPhoto size={10} color="#888" />
                <Text className="text-[#888] text-[10px]">Gallery</Text>
              </View>
            </View>
          </Pressable>

          {/* Option 2 — Manual */}
          <Pressable
            onPress={handleManual}
            className="bg-[#141414] border border-[#1e1e1e] rounded-3xl p-5 overflow-hidden"
          >
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 rounded-2xl bg-[#c9a84c]/15 items-center justify-center">
                <IconPencil size={26} color="#c9a84c" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-base font-bold mb-0.5">
                  Add manually
                </Text>
                <Text className="text-[#888] text-[11px]">
                  Write details yourself, add a photo optionally — no AI scan
                  needed
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2 mt-4">
              <View className="flex-row items-center gap-1 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-full px-2.5 py-1">
                <IconPencil size={10} color="#c9a84c" />
                <Text className="text-[#c9a84c] text-[10px] font-semibold">
                  Self-fill
                </Text>
              </View>
              <View className="flex-row items-center gap-1 bg-[#1e1e1e] rounded-full px-2.5 py-1">
                <IconPhoto size={10} color="#888" />
                <Text className="text-[#888] text-[10px]">Optional photo</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Bottom sheet — camera / gallery picker */}
      <Modal
        visible={sheetRendered}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        <Animated.View className="flex-1 justify-end" style={backdropStyle}>
          <Pressable
            className="absolute inset-0 bg-black/60"
            onPress={closeSheet}
          />
          <Animated.View
            style={[
              sheetStyle,
              { paddingBottom: Math.max(28, insets.bottom + 12) },
            ]}
            className="bg-[#141414] rounded-t-[32px] px-5 pt-5"
          >
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-white text-base font-bold">
                Choose source
              </Text>
              <Pressable
                onPress={closeSheet}
                className="h-8 w-8 rounded-full bg-[#1e1e1e] items-center justify-center"
              >
                <IconX size={14} color="#aaa" />
              </Pressable>
            </View>

            {/* Camera */}
            <Pressable
              onPress={handleCamera}
              className="flex-row items-center gap-4 bg-[#1a1a1a] border border-[#1e1e1e] rounded-2xl p-4 mb-3"
            >
              <View className="h-12 w-12 rounded-xl bg-[#534AB7]/15 items-center justify-center">
                <IconCamera size={22} color="#8b82ff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-sm font-bold">
                  Take a photo
                </Text>
                <Text className="text-[#888] text-[11px] mt-0.5">
                  Use camera — edit before scanning
                </Text>
              </View>
            </Pressable>

            {/* Gallery */}
            <Pressable
              onPress={handleGallery}
              className="flex-row items-center gap-4 bg-[#1a1a1a] border border-[#1e1e1e] rounded-2xl p-4 mb-2"
            >
              <View className="h-12 w-12 rounded-xl bg-[#1D9E75]/15 items-center justify-center">
                <IconPhoto size={22} color="#1D9E75" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-sm font-bold">
                  Choose from gallery
                </Text>
                <Text className="text-[#888] text-[11px] mt-0.5">
                  Pick &amp; crop an existing photo
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}
