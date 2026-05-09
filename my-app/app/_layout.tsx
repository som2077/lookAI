import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AppGradientBackground } from "../components/ui/AppGradientBackground";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        {/* <AppGradientBackground> */}
          <Slot />
        {/* </AppGradientBackground> */}
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
