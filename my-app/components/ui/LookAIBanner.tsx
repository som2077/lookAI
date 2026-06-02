import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const LookAIBanner = React.memo(function LookAIBanner() {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        It&apos;s 32°C and sunny today in Indore! ☀️ I&apos;d suggest going with
        light linen or cotton fabrics in white or pastel tones — they&apos;ll
        keep you cool and still look sharp.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    // marginTop: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#E9EBF8",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
    color: "#171421",
    fontWeight: "400",
  },
});
