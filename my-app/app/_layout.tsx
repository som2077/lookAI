import "../global.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OnboardingProvider } from "@/store/onboarding-store";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      const value = await SecureStore.getItemAsync("onboarding_complete");
      setOnboardingComplete(value === "true");
    };

    void loadOnboardingStatus();
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded || onboardingComplete === null) {
      return;
    }

    const inAuth = segments[0] === "(auth)";
    const inRoot = segments[0] === "(root)";
    const inOnboarding = inRoot && segments.some((segment) => segment === "onboarding");

    if (!isSignedIn) {
      if (!inAuth) {
        router.replace("/(auth)/sign-in");
      }
      return;
    }

    if (!onboardingComplete) {
      if (!inOnboarding) {
        router.replace("/(root)/onboarding");
      }
      return;
    }

    if (inOnboarding || inAuth || !inRoot) {
      router.replace("/(root)/(tabs)");
    }
  }, [isSignedIn, isLoaded, onboardingComplete, router, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <OnboardingProvider>
          <RootNavigator />
        </OnboardingProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
