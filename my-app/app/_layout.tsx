import "../global.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  OnboardingProvider,
  useOnboardingState,
} from "@/store/onboarding-store";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function RootNavigator() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const segmentKey = segments.join("/");
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  );
  const completionVersion = useOnboardingState((s) => s._completionVersion);

  useEffect(() => {
    if (!userId) {
      setOnboardingComplete(null);
      return;
    }

    if (completionVersion > 0) {
      setOnboardingComplete(true);
      return;
    }

    const loadOnboardingStatus = async () => {
      const value = await SecureStore.getItemAsync(
        `onboarding_complete_${userId}`,
      );
      setOnboardingComplete(value === "true");
    };

    void loadOnboardingStatus();
  }, [isSignedIn, userId, completionVersion]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuth = segments[0] === "(auth)";
    const inRoot = segments[0] === "(root)";
    const inOnboarding =
      inRoot && (segments as string[]).includes("onboarding");

    if (!isSignedIn) {
      if (!inAuth) {
        router.replace("/(auth)/sign-in");
      }
      return;
    }

    // Signed in — wait for onboarding status to load
    if (onboardingComplete === null) return;

    if (!onboardingComplete) {
      if (!inOnboarding) {
        router.replace("/(root)/onboarding");
      }
      return;
    }

    if (inOnboarding || inAuth || !inRoot) {
      router.replace("/(root)/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isLoaded, onboardingComplete, segmentKey]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <OnboardingProvider>
            <RootNavigator />
          </OnboardingProvider>
        </SafeAreaProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
