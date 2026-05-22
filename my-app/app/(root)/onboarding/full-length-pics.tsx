import { useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { createSupabaseClient } from "@/backend/api/supabase";

const BUCKET = "full-length-pics";

export default function FullLengthPicsScreen() {
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const [selectedImages, setSelectedImages] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [uploading, setUploading] = useState(false);

  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 2,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.slice(0, 2));
    }
  };

  const uploadToSupabase = async () => {
    if (selectedImages.length === 0) {
      await handlePickImages();
      return;
    }

    setUploading(true);
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token);

      for (const asset of selectedImages) {
        const ext = (
          asset.mimeType?.split("/")[1] ??
          asset.uri.split(".").pop() ??
          "jpg"
        ).split("?")[0];
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const contentType = asset.mimeType ?? `image/${ext}`;

        const formData = new FormData();
        formData.append("file", {
          uri: asset.uri,
          name: fileName.split("/").pop()!,
          type: contentType,
        } as unknown as Blob);

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, formData, {
            contentType: "multipart/form-data",
            upsert: false,
          });

        if (error) {
          throw new Error(error.message);
        }
      }

      router.push("/(root)/onboarding/nickname" as any);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      Alert.alert("Upload Error", message);
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    router.push("/(root)/onboarding/nickname" as any);
  };

  const showPreview = selectedImages.length > 0;

  return (
    // <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 px-5 pb-6 pt-2">
      <OnboardingHeader step={6} />

      <Text className="text-4xl font-semibold tracking-tight px-3 text-[#1D1A27]">
        Full length pics
      </Text>
      <Text className="mt-2 text-xl px-3 text-[#000000]">
        This helps AI understand your body shape and styling needs.
      </Text>

      {/* Image area: show selected previews or placeholder */}
      <View className="mt-5 flex-1 items-center justify-center">
        {showPreview ? (
          <View className="flex-row gap-3">
            {selectedImages.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img.uri }}
                className="h-[300px] w-[190px] rounded-2xl"
                resizeMode="cover"
              />
            ))}
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImages}>
            <Image
              source={require("@/assets/images/full-lenght.png")}
              className="h-[370px] w-[370px]"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tips */}
      <View className="mt-3 items-center gap-2">
        <Text className="text-sm font-medium text-center text-[#000000]">
          Please upload a clear full-length photo with no close-ups, glasses,
          hats, AirPods, bags, pets, or phones.
        </Text>
      </View>

      {/* Buttons */}
      <View className="mt-14 gap-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          className="items-center rounded-2xl bg-[#ECEDF9] py-5"
        >
          <Text className="text-lg font-bold text-[#000000]">Skip now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={showPreview ? uploadToSupabase : handlePickImages}
          disabled={uploading}
          className="items-center rounded-2xl bg-[#000000] py-5"
        >
          {uploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              {showPreview ? "Upload Image" : "Select Images"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
    // </SafeAreaView>
  );
}
