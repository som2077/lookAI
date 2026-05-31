import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconHeart,
  IconHanger,
  IconShirt,
  IconShoe,
  IconScissors,
  IconLayoutGrid,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SavedOutfit {
  id: string;
  name: string;
  occasion: string;
  wears: number;
  items: {
    id: string;
    name: string;
    category: "top" | "bottoms" | "footwear" | "outerwear" | "accessory";
  }[];
  bgColor: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 12;
const GRID_PADDING = 24;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

const CATEGORY_ICONS = {
  top: IconShirt,
  bottoms: IconScissors,
  footwear: IconShoe,
  outerwear: IconShirt,
  accessory: IconHanger,
};

const FILTER_CHIPS = ["All", "Casual", "Office", "Festive", "Formal"];

const INITIAL_OUTFITS: SavedOutfit[] = [
  {
    id: "outfit-1",
    name: "Summer Chic",
    occasion: "Casual",
    wears: 8,
    bgColor: "#FFF4E6", // Light Orange
    items: [
      { id: "1", name: "White Shirt", category: "top" },
      { id: "2", name: "Black Jeans", category: "bottoms" },
      { id: "4", name: "Sneakers", category: "footwear" },
    ],
  },
  {
    id: "outfit-2",
    name: "Work Classic",
    occasion: "Office",
    wears: 4,
    bgColor: "#EBF3FE", // Light Blue
    items: [
      { id: "5", name: "Grey Blazer", category: "outerwear" },
      { id: "1", name: "White Shirt", category: "top" },
      { id: "6", name: "Beige Chinos", category: "bottoms" },
    ],
  },
  {
    id: "outfit-3",
    name: "Festive Vibes",
    occasion: "Festive",
    wears: 2,
    bgColor: "#FFF0F5", // Light Pink
    items: [
      { id: "3", name: "Blue Kurta", category: "top" },
      { id: "6", name: "Beige Chinos", category: "bottoms" },
    ],
  },
  {
    id: "outfit-4",
    name: "Weekend Chill",
    occasion: "Casual",
    wears: 12,
    bgColor: "#EBFBEE", // Light Green
    items: [
      { id: "1", name: "White Shirt", category: "top" },
      { id: "6", name: "Beige Chinos", category: "bottoms" },
      { id: "4", name: "Sneakers", category: "footwear" },
    ],
  },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

const OutfitPreview = React.memo(function OutfitPreview({
  items,
  bgColor,
}: {
  items: SavedOutfit["items"];
  bgColor: string;
}) {
  return (
    <View
      style={{
        height: 110,
        backgroundColor: bgColor,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {items.slice(0, 3).map((item, index) => {
        const Icon = CATEGORY_ICONS[item.category] || IconHanger;

        const rotate = index === 0 ? "-8deg" : index === 2 ? "8deg" : "0deg";
        const translateX = index === 0 ? -10 : index === 2 ? 10 : 0;
        const zIndex = index === 1 ? 2 : 1;
        const scale = index === 1 ? 1.05 : 0.95;

        return (
          <View
            key={item.id}
            style={{
              width: 44,
              height: 54,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E2E2EA",
              alignItems: "center",
              justifyContent: "center",
              zIndex,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
              transform: [{ rotate }, { translateX }, { scale }],
              elevation: zIndex,
            }}
          >
            <Icon size={18} color="#9B9BAF" strokeWidth={1.5} />
          </View>
        );
      })}
    </View>
  );
});

const OutfitCard = React.memo(function OutfitCard({
  outfit,
  onUnsave,
}: {
  outfit: SavedOutfit;
  onUnsave: (id: string) => void;
}) {
  return (
    <Pressable
      style={{
        width: CARD_WIDTH,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E2E2EA",
        padding: 12,
        marginBottom: GRID_GAP,
      }}
    >
      {/* Visual overlapping cards */}
      <OutfitPreview items={outfit.items} bgColor={outfit.bgColor} />

      {/* Outfit Title & Occasion */}
      <View style={{ marginTop: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1D1A27",
              flex: 1,
              marginRight: 6,
            }}
          >
            {outfit.name}
          </Text>

          <Pressable onPress={() => onUnsave(outfit.id)} style={{ padding: 4 }}>
            <IconHeart
              size={18}
              color="#EF4444"
              fill="#EF4444"
              strokeWidth={1.5}
            />
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View
            style={{
              backgroundColor: "#F4F4F6",
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 9, color: "#9B9BAF", fontWeight: "600" }}>
              {outfit.occasion}
            </Text>
          </View>

          <Text style={{ fontSize: 9, color: "#9B9BAF", fontWeight: "500" }}>
            Worn {outfit.wears}×
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

const EmptyState = React.memo(function EmptyState({
  onExplore,
}: {
  onExplore: () => void;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 80,
        paddingHorizontal: 40,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#FFEBEB",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <IconHeart size={36} color="#EF4444" strokeWidth={1.5} />
      </View>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "700",
          color: "#1D1A27",
          marginBottom: 6,
        }}
      >
        No saved outfits yet
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: "#9B9BAF",
          textAlign: "center",
          lineHeight: 18,
          marginBottom: 24,
        }}
      >
        Generate outfit combinations using the AI Planner or save your favorite
        matches to see them here.
      </Text>
      <Pressable
        onPress={onExplore}
        style={{
          backgroundColor: "#1D1A27",
          borderRadius: 14,
          paddingHorizontal: 24,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>
          Explore AI Planner
        </Text>
      </Pressable>
    </View>
  );
});

// ─── Main Saved Screen ───────────────────────────────────────────────────────

export default function SavedScreen() {
  const router = useRouter();
  const [activeChip, setActiveChip] = useState("All");
  const [outfits, setOutfits] = useState<SavedOutfit[]>(INITIAL_OUTFITS);

  const filteredOutfits = useMemo(() => {
    if (activeChip === "All") return outfits;
    return outfits.filter((outfit) => outfit.occasion === activeChip);
  }, [activeChip, outfits]);

  const handleUnsave = useCallback((id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const handleExplore = useCallback(() => {
    router.push("/(root)/(tabs)/outfit" as never);
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: SavedOutfit }) => (
      <OutfitCard outfit={item} onUnsave={handleUnsave} />
    ),
    [handleUnsave],
  );

  const keyExtractor = useCallback((item: SavedOutfit) => item.id, []);

  return (
    <SwipeTabWrapper tabIndex={2}>
      <View style={{ flex: 1, backgroundColor: "#F8F7FC" }}>
        <StatusBar style="dark" />
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#1D1A27",
              }}
            >
              Saved Outfits
            </Text>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable>
                <IconSearch size={22} color="#1D1A27" strokeWidth={2} />
              </Pressable>
              <Pressable>
                <IconAdjustmentsHorizontal
                  size={22}
                  color="#1D1A27"
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </View>

          {/* Grid Layout list */}
          <FlatList
            data={filteredOutfits}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 24,
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={{ marginTop: 4 }}>
                {/* Occasion Filter Chips */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
                  style={{ marginBottom: 18, maxHeight: 42 }}
                >
                  {FILTER_CHIPS.map((chip) => {
                    const isActive = chip === activeChip;
                    return (
                      <Pressable
                        key={chip}
                        onPress={() => setActiveChip(chip)}
                        style={{
                          backgroundColor: isActive ? "#1D1A27" : "#FFFFFF",
                          borderWidth: 1,
                          borderColor: isActive ? "#1D1A27" : "#E9EBF8",
                          borderRadius: 20,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: isActive ? "#FFFFFF" : "#9B9BAF",
                          }}
                        >
                          {chip}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Subtitle Count */}
                {filteredOutfits.length > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#7E7C8C",
                      fontWeight: "500",
                      paddingHorizontal: 24,
                      marginBottom: 12,
                    }}
                  >
                    {filteredOutfits.length}{" "}
                    {filteredOutfits.length === 1 ? "saved look" : "saved looks"}
                  </Text>
                )}
              </View>
            }
            ListEmptyComponent={<EmptyState onExplore={handleExplore} />}
          />
        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
