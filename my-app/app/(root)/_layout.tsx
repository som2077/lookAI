import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0c0c0c" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen
        name="log-outfit"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="add-clothes"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="streak" options={{ animation: "slide_from_right" }} />
      <Stack.Screen
        name="calendar"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="trend-feed" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="look-ai" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
