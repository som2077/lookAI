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
import { useUser } from "@clerk/clerk-expo";
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconPlus,
  IconHanger,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";
import { useWardrobeSummary } from "@/backend/hooks/useWardrobeSummary";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryId =
  | "all"
  | "top"
  | "dress"
  | "bottoms"
  | "ethnic"
  | "outerwear"
  | "footwear"
  | "accessory";

interface CategoryChip {
  id: CategoryId;
  label: string;
}

interface ClothingItem {
  id: string;
  name: string;
  category: CategoryId;
  color: string;
  bgColor: string;
  occasion: string;
  wears: number;
  isNew: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 10;
const GRID_PADDING = 24;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

const CATEGORIES: CategoryChip[] = [
  { id: "all", label: "All" },
  { id: "top", label: "Tops" },
  { id: "dress", label: "Dress" },
  { id: "bottoms", label: "Bottoms" },
  { id: "ethnic", label: "Ethnic" },
  { id: "outerwear", label: "Outerwear" },
  { id: "footwear", label: "Footwear" },
  { id: "accessory", label: "Accessory" },
];

const MOCK_ITEMS: ClothingItem[] = [
  {
    id: "1",
    name: "Blue Kurta",
    category: "ethnic",
    color: "Navy Blue",
    bgColor: "#D6E4FF",
    occasion: "Casual",
    wears: 5,
    isNew: false,
  },
  {
    id: "2",
    name: "Floral Dress",
    category: "dress",
    color: "Pink",
    bgColor: "#FFE0EC",
    occasion: "Party",
    wears: 3,
    isNew: false,
  },
  {
    id: "3",
    name: "Denim Jacket",
    category: "outerwear",
    color: "Blue",
    bgColor: "#DBEAFE",
    occasion: "Casual",
    wears: 8,
    isNew: false,
  },
  {
    id: "4",
    name: "White Sneakers",
    category: "footwear",
    color: "White",
    bgColor: "#F1F5F9",
    occasion: "Casual",
    wears: 12,
    isNew: false,
  },
  {
    id: "5",
    name: "Black Top",
    category: "top",
    color: "Black",
    bgColor: "#E2E2EA",
    occasion: "Office",
    wears: 0,
    isNew: true,
  },
  {
    id: "6",
    name: "Palazzo Pants",
    category: "bottoms",
    color: "Beige",
    bgColor: "#FEF3C7",
    occasion: "Casual",
    wears: 2,
    isNew: true,
  },
  {
    id: "7",
    name: "Gold Earrings",
    category: "accessory",
    color: "Gold",
    bgColor: "#FEF9C3",
    occasion: "Wedding",
    wears: 1,
    isNew: false,
  },
  {
    id: "8",
    name: "Red Saree",
    category: "ethnic",
    color: "Red",
    bgColor: "#FEE2E2",
    occasion: "Wedding",
    wears: 0,
    isNew: true,
  },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

const CategoryFilter = React.memo(function CategoryFilter({
  active,
  onSelect,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
      className="mb-4"
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === active;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
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
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

const StatItem = React.memo(function StatItem({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "800",
          color,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: "#9B9BAF",
          marginTop: 2,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </View>
  );
});

const StatsBar = React.memo(function StatsBar({
  total,
  worn,
  never,
}: {
  total: number;
  worn: number;
  never: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginHorizontal: 24,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#E9EBF8",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <StatItem value={total} label="Total Items" color="#1D1A27" />
      <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
      <StatItem value={worn} label="Worn" color="#F5B93A" />
      <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
      <StatItem value={never} label="Never Worn" color="#E54B4B" />
    </View>
  );
});

const ClothingCard = React.memo(function ClothingCard({
  item,
}: {
  item: ClothingItem;
}) {
  return (
    <Pressable
      style={{
        width: CARD_WIDTH,
        marginBottom: GRID_GAP,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E9EBF8",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {/* Placeholder image area */}
      <View
        style={{
          height: 150,
          backgroundColor: item.bgColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconHanger size={36} color="#1D1A2730" strokeWidth={1.5} />

        {/* New badge */}
        {item.isNew && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#1D1A27",
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "700" }}
            >
              NEW
            </Text>
          </View>
        )}
      </View>

      {/* Card info */}
      <View style={{ padding: 10 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#1D1A27",
            marginBottom: 4,
          }}
        >
          {item.name}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Category pill */}
          <View
            style={{
              backgroundColor: "#F4F4F6",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{ fontSize: 10, color: "#9B9BAF", fontWeight: "600" }}
            >
              {item.occasion}
            </Text>
          </View>

          {/* Wear count */}
          <Text
            style={{
              fontSize: 10,
              color: item.wears === 0 ? "#E54B4B" : "#9B9BAF",
              fontWeight: "600",
            }}
          >
            {item.wears === 0 ? "Never worn" : `${item.wears} wears`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

const EmptyState = React.memo(function EmptyState({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 40,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#F4F4F6",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <IconHanger size={36} color="#9B9BAF" strokeWidth={1.5} />
      </View>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "700",
          color: "#1D1A27",
          marginBottom: 6,
        }}
      >
        Your wardrobe is empty
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: "#9B9BAF",
          textAlign: "center",
          lineHeight: 18,
          marginBottom: 20,
        }}
      >
        Start adding your clothes to track what you wear and discover new outfit
        ideas
      </Text>
      <Pressable
        onPress={onAdd}
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
        <IconPlus size={16} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>
          Add your first item
        </Text>
      </Pressable>
    </View>
  );
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function WardrobeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { summary } = useWardrobeSummary(user?.id);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return MOCK_ITEMS;
    return MOCK_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleAddClothes = useCallback(() => {
    router.push("/(root)/add-clothes" as never);
  }, [router]);

  const handleCategorySelect = useCallback((id: CategoryId) => {
    setActiveCategory(id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ClothingItem }) => <ClothingCard item={item} />,
    [],
  );

  const renderEmpty = useCallback(
    () => <EmptyState onAdd={handleAddClothes} />,
    [handleAddClothes],
  );

  const keyExtractor = useCallback((item: ClothingItem) => item.id, []);

  return (
    <SwipeTabWrapper tabIndex={1}>
      <AppGradientBackground>
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#1D1A27",
              }}
            >
              My Wardrobe
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#F8F7FC",
                  borderWidth: 1,
                  borderColor: "#E2E2EA",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconSearch size={18} color="#1D1A27" strokeWidth={2} />
              </Pressable>
              <Pressable
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#F8F7FC",
                  borderWidth: 1,
                  borderColor: "#E2E2EA",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconAdjustmentsHorizontal
                  size={18}
                  color="#1D1A27"
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </View>

          {/* Category Filter */}
          <CategoryFilter
            active={activeCategory}
            onSelect={handleCategorySelect}
          />

          {/* Stats Summary */}
          <StatsBar
            total={MOCK_ITEMS.length}
            worn={summary.totalWorn || MOCK_ITEMS.filter((i) => i.wears > 0).length}
            never={summary.neverCount || MOCK_ITEMS.filter((i) => i.wears === 0).length}
          />

          {/* Clothing Grid */}
          <FlatList
            data={filteredItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 24,
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
          />
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
