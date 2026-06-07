import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function WardrobeMessageBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Track your wardrobe, rediscover unworn pieces, and make every outfit count.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F3F8", // Soft light grey/blue
    borderRadius: 16, // Pill-like rounded corners
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    fontFamily: "TikTokSans16pt-Medium",
    color: "#1C1C1E",
    lineHeight: 20,
  },
});
