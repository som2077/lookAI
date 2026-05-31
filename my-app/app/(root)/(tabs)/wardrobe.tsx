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
import { StatusBar } from "expo-status-bar";
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconPlus,
  IconHanger,
  IconShirt,
  IconShoe,
  IconScissors,
  IconLayoutGrid,
  IconChevronRight,
  IconSparkles,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { useWardrobeSummary } from "@/backend/hooks/useWardrobeSummary";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryId =
  | "all"
  | "top"
  | "bottoms"
  | "footwear"
  | "outerwear"
  | "dress"
  | "ethnic"
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
const GRID_GAP = 8;
const GRID_PADDING = 24;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * 2) / 3;

const CATEGORIES: CategoryChip[] = [
  { id: "all", label: "All" },
  { id: "top", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "footwear", label: "Shoes" },
  { id: "outerwear", label: "Outerwear" },
  { id: "dress", label: "Dress" },
  { id: "ethnic", label: "Ethnic" },
  { id: "accessory", label: "Accessory" },
];

const CATEGORY_ICONS: Record<CategoryId, React.ComponentType<any>> = {
  all: IconLayoutGrid,
  top: IconShirt,
  bottoms: IconScissors,
  footwear: IconShoe,
  outerwear: IconShirt,
  dress: IconShirt,
  ethnic: IconShirt,
  accessory: IconHanger,
};

const GROUP_HEADER_ICONS: Record<
  CategoryId,
  { Icon: React.ComponentType<any>; color: string }
> = {
  all: { Icon: IconLayoutGrid, color: "#9B9BAF" },
  top: { Icon: IconShirt, color: "#10B981" }, // Green for Tops
  bottoms: { Icon: IconScissors, color: "#3B82F6" }, // Blue for Bottoms
  footwear: { Icon: IconShoe, color: "#FBBF24" },
  outerwear: { Icon: IconShirt, color: "#A78BFA" },
  dress: { Icon: IconShirt, color: "#EC4899" },
  ethnic: { Icon: IconShirt, color: "#F43F5E" },
  accessory: { Icon: IconHanger, color: "#6B7280" },
};

// ─── Mock Data matching the screenshot ────────────────────────────────────────

const BASE_MOCK_ITEMS: ClothingItem[] = [
  {
    id: "1",
    name: "White Shirt",
    category: "top",
    color: "White",
    bgColor: "#F8F7FC",
    occasion: "Casual",
    wears: 8,
    isNew: false,
  },
  {
    id: "2",
    name: "Black Jeans",
    category: "bottoms",
    color: "Black",
    bgColor: "#F8F7FC",
    occasion: "Casual",
    wears: 5,
    isNew: false,
  },
  {
    id: "3",
    name: "Blue Kurta",
    category: "top",
    color: "Blue",
    bgColor: "#F8F7FC",
    occasion: "Casual",
    wears: 0,
    isNew: true,
  },
  {
    id: "4",
    name: "Sneakers",
    category: "footwear",
    color: "White",
    bgColor: "#F8F7FC",
    occasion: "Casual",
    wears: 12,
    isNew: false,
  },
  {
    id: "5",
    name: "Grey Blazer",
    category: "outerwear",
    color: "Grey",
    bgColor: "#F8F7FC",
    occasion: "Formal",
    wears: 0,
    isNew: true,
  },
  {
    id: "6",
    name: "Beige Chinos",
    category: "bottoms",
    color: "Beige",
    bgColor: "#F8F7FC",
    occasion: "Casual",
    wears: 0,
    isNew: true,
  },
];

// Generate extra mock items to reach exactly 48 total items as seen in screenshot
const generateMockItems = (): ClothingItem[] => {
  const items = [...BASE_MOCK_ITEMS];
  const categories: CategoryId[] = [
    "top",
    "bottoms",
    "footwear",
    "outerwear",
    "dress",
    "ethnic",
    "accessory",
  ];
  const names = [
    "Red T-Shirt",
    "Chino Pants",
    "Brown Boots",
    "Black Leather Jacket",
    "Summer Dress",
    "Sherwani",
    "Sunglasses",
    "Wool Scarf",
    "Silk Tie",
    "Running Shoes",
    "Jeans Jacket",
    "Cargo Shorts",
    "Hoodie",
    "Sweater",
  ];

  for (let i = 7; i <= 48; i++) {
    const category = categories[i % categories.length];
    const name = `${names[i % names.length]} #${i}`;
    const wears = i % 4 === 0 ? 0 : Math.floor(Math.random() * 15) + 1; // 25% unworn to get exactly 12 unworn items
    items.push({
      id: String(i),
      name,
      category,
      color: "Various",
      bgColor: "#F8F7FC",
      occasion: i % 2 === 0 ? "Casual" : "Formal",
      wears,
      isNew: wears === 0 && i % 3 === 0,
    });
  }
  return items;
};

const MOCK_ITEMS = generateMockItems();

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
      style={{ marginBottom: 16, maxHeight: 42 }}
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

const StatsBar = React.memo(function StatsBar({
  total,
  worn,
  unworn,
  usage,
}: {
  total: number;
  worn: number;
  unworn: number;
  usage: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginHorizontal: 24,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#E9EBF8",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#3B82F6" }}>
          {total}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "#9B9BAF",
            marginTop: 2,
            fontWeight: "500",
          }}
        >
          Total
        </Text>
      </View>
      <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#10B981" }}>
          {worn}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "#9B9BAF",
            marginTop: 2,
            fontWeight: "500",
          }}
        >
          Worn
        </Text>
      </View>
      <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#EF4444" }}>
          {unworn}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "#9B9BAF",
            marginTop: 2,
            fontWeight: "500",
          }}
        >
          Unworn
        </Text>
      </View>
      <View style={{ width: 1, backgroundColor: "#E9EBF8" }} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#FBBF24" }}>
          {usage}%
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "#9B9BAF",
            marginTop: 2,
            fontWeight: "500",
          }}
        >
          Usage
        </Text>
      </View>
    </View>
  );
});

// ─── Segmented View Toggle ───────────────────────────────────────────────────

const ViewToggle = React.memo(function ViewToggle({
  viewMode,
  onToggle,
}: {
  viewMode: "grouped" | "grid";
  onToggle: (mode: "grouped" | "grid") => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#E5E5EA",
        borderRadius: 10,
        padding: 2,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => onToggle("grouped")}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: viewMode === "grouped" ? "#FFFFFF" : "transparent",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: viewMode === "grouped" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: viewMode === "grouped" ? 2 : 0,
        }}
      >
        <View style={{ gap: 3 }}>
          <View
            style={{
              width: 14,
              height: 4,
              borderRadius: 1,
              backgroundColor: viewMode === "grouped" ? "#121212" : "#7E7C8C",
            }}
          />
          <View
            style={{
              width: 14,
              height: 4,
              borderRadius: 1,
              backgroundColor: viewMode === "grouped" ? "#121212" : "#7E7C8C",
            }}
          />
        </View>
      </Pressable>

      <Pressable
        onPress={() => onToggle("grid")}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: viewMode === "grid" ? "#FFFFFF" : "transparent",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: viewMode === "grid" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: viewMode === "grid" ? 2 : 0,
        }}
      >
        <IconLayoutGrid
          size={16}
          color={viewMode === "grid" ? "#121212" : "#7E7C8C"}
          strokeWidth={2.5}
        />
      </Pressable>
    </View>
  );
});

// ─── 3-Column Grid View Components ──────────────────────────────────────────

const ClothingCard = React.memo(function ClothingCard({
  item,
}: {
  item: ClothingItem;
}) {
  const Icon = CATEGORY_ICONS[item.category] || IconHanger;
  const isWorn = item.wears > 0;

  return (
    <Pressable
      style={{
        width: CARD_WIDTH,
        height: 155,
        marginBottom: GRID_GAP,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E2EA",
        overflow: "hidden",
      }}
    >
      {/* Icon Area */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F7FC",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Status Badge */}
        <View
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            backgroundColor: isWorn ? "#E8F8F0" : "#FFF0F0",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: "700",
              color: isWorn ? "#10B981" : "#EF4444",
            }}
          >
            {isWorn ? "✓ worn" : "✗ new"}
          </Text>
        </View>

        <Icon size={28} color="#9B9BAF" strokeWidth={1.5} />
      </View>

      {/* Info Area */}
      <View style={{ padding: 8, height: 50, justifyContent: "center" }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#1D1A27",
            marginBottom: 2,
          }}
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 9,
            color: "#9B9BAF",
          }}
        >
          {CATEGORIES.find((c) => c.id === item.category)?.label || "Item"} ·{" "}
          {item.wears}×
        </Text>
      </View>
    </Pressable>
  );
});

const AddClothCard = React.memo(function AddClothCard({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        height: 155,
        marginBottom: GRID_GAP,
        backgroundColor: "#F8F7FC",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E2EA",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      }}
    >
      <IconPlus size={28} color="#9B9BAF" strokeWidth={1.5} />
      <View style={{ marginTop: 12, alignItems: "center" }}>
        <Text style={{ fontSize: 11, fontWeight: "600", color: "#9B9BAF" }}>
          Add cloth
        </Text>
        <Text style={{ fontSize: 10, color: "#B5B5C3", marginTop: 2 }}>
          Upload
        </Text>
      </View>
    </Pressable>
  );
});

// ─── Grouped Carousel View Components ───────────────────────────────────────

const CarouselAddClothCard = React.memo(function CarouselAddClothCard({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 110,
        height: 170,
        marginRight: 10,
        backgroundColor: "#F8F7FC",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E2EA",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      }}
    >
      <IconPlus size={24} color="#9B9BAF" strokeWidth={1.5} />
      <View style={{ marginTop: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 11, fontWeight: "600", color: "#9B9BAF" }}>
          Add
        </Text>
        <Text style={{ fontSize: 10, color: "#B5B5C3", marginTop: 2 }}>
          Upload
        </Text>
      </View>
    </Pressable>
  );
});

const CarouselClothingCard = React.memo(function CarouselClothingCard({
  item,
}: {
  item: ClothingItem;
}) {
  const Icon = CATEGORY_ICONS[item.category] || IconHanger;
  const isWorn = item.wears > 0;

  return (
    <Pressable
      style={{
        width: 110,
        height: 170,
        marginRight: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E2EA",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {/* Icon Area */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F7FC",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Status Badge in Top-Left */}
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: isWorn ? "#E8F8F0" : "#FFF0F0",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: "700",
              color: isWorn ? "#10B981" : "#EF4444",
            }}
          >
            {isWorn ? "worn" : "new"}
          </Text>
        </View>

        <Icon size={28} color="#9B9BAF" strokeWidth={1.5} />
      </View>

      {/* Info Area */}
      <View style={{ padding: 8, height: 52, justifyContent: "center" }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#1D1A27",
            marginBottom: 2,
          }}
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 9,
            color: "#9B9BAF",
          }}
        >
          {isWorn ? `${item.wears}× worn` : "Never worn"}
        </Text>
      </View>
    </Pressable>
  );
});

const GroupHeader = React.memo(function GroupHeader({
  category,
  count,
}: {
  category: CategoryChip;
  count: number;
}) {
  const { Icon, color } = GROUP_HEADER_ICONS[category.id] || {
    Icon: IconHanger,
    color: "#6B7280",
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 18,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon size={20} color={color} strokeWidth={2} />
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1D1A27" }}>
          {category.label}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: "#9B9BAF", fontWeight: "500" }}>
        {count} {count === 1 ? "item" : "items"}
      </Text>
    </View>
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
  const [viewMode, setViewMode] = useState<"grouped" | "grid">("grouped");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return MOCK_ITEMS;
    return MOCK_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const displayItems = useMemo(() => {
    return [
      {
        id: "upload",
        name: "Add cloth",
        category: "all" as any,
        wears: 0,
        isNew: false,
        color: "",
        bgColor: "",
        occasion: "",
      },
      ...filteredItems,
    ];
  }, [filteredItems]);

  const groupableCategories = useMemo(() => {
    if (activeCategory !== "all") {
      return CATEGORIES.filter((cat) => cat.id === activeCategory);
    }
    // Return all categories that have items in MOCK_ITEMS
    return CATEGORIES.filter(
      (cat) =>
        cat.id !== "all" && MOCK_ITEMS.some((item) => item.category === cat.id),
    );
  }, [activeCategory]);

  const handleAddClothes = useCallback(() => {
    router.push("/(root)/add-clothes" as never);
  }, [router]);

  const handleCategorySelect = useCallback((id: CategoryId) => {
    setActiveCategory(id);
  }, []);

  const total = MOCK_ITEMS.length;
  const worn =
    summary.totalWorn || MOCK_ITEMS.filter((i) => i.wears > 0).length;
  const unworn =
    summary.neverCount || MOCK_ITEMS.filter((i) => i.wears === 0).length;
  const usage = summary.wornPercentage
    ? Math.round(summary.wornPercentage * 100)
    : total > 0
      ? Math.round((worn / total) * 100)
      : 0;

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.id === "upload") {
        return <AddClothCard onPress={handleAddClothes} />;
      }
      return <ClothingCard item={item} />;
    },
    [handleAddClothes],
  );

  const renderGroupedRow = useCallback(
    ({ item: category }: { item: CategoryChip }) => {
      // Find items belonging to this category
      const categoryItems = MOCK_ITEMS.filter(
        (item) => item.category === category.id,
      );

      return (
        <View style={{ marginBottom: 12 }}>
          <GroupHeader category={category} count={categoryItems.length} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <CarouselAddClothCard onPress={handleAddClothes} />
            {categoryItems.map((clothingItem) => (
              <CarouselClothingCard key={clothingItem.id} item={clothingItem} />
            ))}
          </ScrollView>
        </View>
      );
    },
    [handleAddClothes],
  );

  const renderEmpty = useCallback(
    () => <EmptyState onAdd={handleAddClothes} />,
    [handleAddClothes],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SwipeTabWrapper tabIndex={1}>
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
              My Wardrobe
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

          {/* Category Filter */}
          <CategoryFilter
            active={activeCategory}
            onSelect={handleCategorySelect}
          />

          {viewMode === "grid" ? (
            <FlatList
              key="grid-view"
              data={displayItems}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: GRID_GAP,
                paddingHorizontal: 24,
              }}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={{ marginTop: 8 }}>
                  {/* Stats Summary */}
                  <StatsBar
                    total={total}
                    worn={worn}
                    unworn={unworn}
                    usage={usage}
                  />

                  {/* Count and Sort Bar */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 24,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#7E7C8C",
                        fontWeight: "500",
                      }}
                    >
                      {filteredItems.length} items
                    </Text>

                    <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
                  </View>
                </View>
              }
              ListFooterComponent={
                filteredItems.length > 0 ? (
                  <View style={{ marginTop: 24 }}>
                    {/* AI Suggestion Card */}
                    <Pressable
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: 24,
                        marginBottom: 24,
                        padding: 14,
                        backgroundColor: "#121212",
                        borderRadius: 20,
                      }}
                    >
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          backgroundColor: "#1C1B2A",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconSparkles size={20} color="#3B82F6" />
                      </View>
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "#FFFFFF",
                          }}
                        >
                          {unworn} clothes never worn
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#8E8C9A",
                            marginTop: 4,
                          }}
                        >
                          Get AI outfit ideas for them →
                        </Text>
                      </View>
                      <IconChevronRight size={18} color="#7E7C8C" />
                    </Pressable>
                  </View>
                ) : null
              }
            />
          ) : (
            <FlatList
              key="grouped-view"
              data={groupableCategories}
              keyExtractor={(cat) => cat.id}
              renderItem={renderGroupedRow}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={{ marginTop: 8 }}>
                  {/* Stats Summary */}
                  <StatsBar
                    total={total}
                    worn={worn}
                    unworn={unworn}
                    usage={usage}
                  />

                  {/* Count and Sort Bar */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 24,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#7E7C8C",
                        fontWeight: "500",
                      }}
                    >
                      {total} items
                    </Text>

                    <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
                  </View>
                </View>
              }
              ListFooterComponent={
                <View style={{ marginTop: 24 }}>
                  {/* AI Suggestion Card */}
                  <Pressable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 24,
                      marginBottom: 24,
                      padding: 14,
                      backgroundColor: "#121212",
                      borderRadius: 20,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: "#1C1B2A",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconSparkles size={20} color="#3B82F6" />
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#FFFFFF",
                        }}
                      >
                        {unworn} clothes never worn
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#8E8C9A",
                          marginTop: 4,
                        }}
                      >
                        Get AI outfit ideas for them →
                      </Text>
                    </View>
                    <IconChevronRight size={18} color="#7E7C8C" />
                  </Pressable>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
