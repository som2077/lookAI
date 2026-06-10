import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";
import { StatusBar } from "expo-status-bar";

export default function ExploreScreen() {
  return (
    <SwipeTabWrapper tabIndex={2}>
      <AppGradientBackground>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.container} edges={["top"]}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover new outfits and trends.</Text>
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
});
