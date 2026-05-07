import { Href, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useSSO } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

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
      const { createdSessionId, setActive, authSessionResult } =
        await startSSOFlow({
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
    <SafeAreaView className="flex-1 bg-transparent">
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Kribb
        </Text>
        <Text className="text-gray-500 mb-8">
          Continue with your Google account.
        </Text>

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        <TouchableOpacity
          onPress={onGooglePress}
          disabled={isLoading}
          className="w-full border border-white/60 bg-white/70 py-4 rounded-2xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="#2563EB" />
          ) : (
            <Text className="text-gray-800 font-bold text-base">
              Continue with Google
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/email" as Href)}
          disabled={isLoading}
          className="w-full bg-[#1A1827] py-4 rounded-2xl items-center mt-3"
        >
          <Text className="text-white font-bold text-base">
            Continue with Email
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
