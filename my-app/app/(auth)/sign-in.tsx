import { Href, useRouter } from "expo-router";
import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const getStartedLogo = require("../../assets/images/getStartedLogo.png");

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray(error.errors) &&
    error.errors[0]?.message
  ) {
    const firstError = error.errors[0];
    const field = firstError.meta?.paramName;

    return field ? `${field} ${firstError.message}` : firstError.message;
  }

  return "Google sign-in failed. Please try again.";
};

export default function SignIn() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onGooglePress = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/", { scheme: "myapp" }),
      });

      if (authSessionResult?.type === "cancel") {
        return;
      }

      if (!createdSessionId) {
        setError("Google sign-in could not be completed.");
        return;
      }

      await setActive?.({ session: createdSessionId });
      router.replace("/(root)/(tabs)");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1 px-8 py-6">
        <View className="flex-1 justify-center">
          <Image
            source={getStartedLogo}
            className="mb-16 h-36 self-center"
            resizeMode="contain"
          />

          <Text className="mt-16 text-[40px] font-bold leading-[50px] bg-red-300 tracking-[-5.60px] text-[#1D1A27]">
            Welcome to Look AI 👋🏻
          </Text>

          <Text className="mt-4 text-[38px] leading-[38px] text-[#4D4858]">
            Your personal AI stylist that helps you choose perfect outfits.
          </Text>

          <Text className="mt-2 text-[30px] leading-[38px] text-[#4D4858]">
            Dress smart. Feel confident.
          </Text>
        </View>

        <View>
          {error ? (
            <Text className="mb-3 text-center text-sm text-red-500">
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={onGooglePress}
            disabled={isLoading}
            className="w-full items-center rounded-2xl border border-[#D8D6DD] bg-white py-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              <Text className="text-lg font-medium text-[#1D1A27]">
                 Continue with Google
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/email" as Href)}
            disabled={isLoading}
            className="mt-3 w-full items-center rounded-2xl bg-[#1A1827] py-4"
          >
            <Text className="text-lg font-medium text-white">
              Continue with Email
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 px-1 text-center font-semibold text-sm leading-5 text-[#191919]">
            By continuing, you accept our{" "}
            <Text className="underline font-black ">Terms of Service</Text> and
            acknowledge our{" "}
            <Text className="underline font-black ">Privacy Policy</Text>. You
            can tap them to view details.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
