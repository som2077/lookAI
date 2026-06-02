import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FilterTab = "Days" | "Weeks" | "Months" | "All";

const TABS: FilterTab[] = ["Days", "Weeks", "Months", "All"];

interface WardrobeFilterTabsProps {
  onChange?: (tab: FilterTab) => void;
}

export function WardrobeFilterTabs({ onChange }: WardrobeFilterTabsProps) {
  const [active, setActive] = useState<FilterTab>("Days");

  const handlePress = (tab: FilterTab) => {
    setActive(tab);
    onChange?.(tab);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => handlePress(tab)}
          style={[styles.tab, active === tab && styles.tabActive]}
        >
          <Text style={[styles.label, active === tab && styles.labelActive]}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#E9EBF890",
    borderRadius: 14,
    borderColor: "#E9EBF8",
    borderWidth: 1,
    padding: 2,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E9EBF8",
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  labelActive: {
    fontWeight: "700",
    color: "#1C1C1E",
  },
});
