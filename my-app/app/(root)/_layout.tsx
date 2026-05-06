import { useAuth, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Redirect, Slot, useSegments } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const onboardingKey = (userId: string) => `onboarding_completed_${userId}`;

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const segments = useSegments();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  const isOnboardingRoute = useMemo(() => segments.includes("onboarding"), [segments]);

  useEffect(() => {
    let isMounted = true;

    const loadOnboardingState = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) {
        if (isMounted) {
          setOnboardingCompleted(null);
        }
        return;
      }

      const value = await SecureStore.getItemAsync(onboardingKey(user.id));
      if (isMounted) {
        setOnboardingCompleted(value === "true");
      }
    };

    loadOnboardingState();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (onboardingCompleted === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#2563EB" />
      </View>
    );
  }

  if (!onboardingCompleted && !isOnboardingRoute) {
    return <Redirect href="/(root)/onboarding" />;
  }

  if (onboardingCompleted && isOnboardingRoute) {
    return <Redirect href="/(root)/(tabs)" />;
  }

  return <Slot />;
}
