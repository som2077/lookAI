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
  IconPlus,
  IconHanger,
  IconShirt,
  IconShoe,
  IconScissors,
  IconLayoutGrid,
  IconChevronRight,
  IconSparkles,
  IconList,
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
  emoji: string;
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
const GRID_GAP = 12;
const GRID_PADDING = 20;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * 2) / 3;

const CATEGORIES: CategoryChip[] = [
  { id: "all",       label: "All",       emoji: "✨" },
  { id: "top",       label: "Tops",      emoji: "👕" },
  { id: "bottoms",   label: "Bottoms",   emoji: "👖" },
  { id: "footwear",  label: "Shoes",     emoji: "👟" },
  { id: "outerwear", label: "Outer",     emoji: "🧥" },
  { id: "dress",     label: "Dress",     emoji: "👗" },
  { id: "ethnic",    label: "Ethnic",    emoji: "🎽" },
  { id: "accessory", label: "Accessory", emoji: "👜" },
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

const CATEGORY_COLORS: Record<CategoryId, string> = {
  all:       "#6366F1",
  top:       "#10B981",
  bottoms:   "#3B82F6",
  footwear:  "#F59E0B",
  outerwear: "#8B5CF6",
  dress:     "#EC4899",
  ethnic:    "#EF4444",
  accessory: "#6B7280",
};

const CATEGORY_BG: Record<CategoryId, string> = {
  all:       "#EEF2FF",
  top:       "#ECFDF5",
  bottoms:   "#EFF6FF",
  footwear:  "#FFFBEB",
  outerwear: "#F5F3FF",
  dress:     "#FDF2F8",
  ethnic:    "#FFF1F2",
  accessory: "#F9FAFB",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BASE_MOCK_ITEMS: ClothingItem[] = [
  { id: "1", name: "White Shirt",    category: "top",       color: "White", bgColor: "#F8F7FC", occasion: "Casual", wears: 8,  isNew: false },
  { id: "2", name: "Black Jeans",    category: "bottoms",   color: "Black", bgColor: "#F8F7FC", occasion: "Casual", wears: 5,  isNew: false },
  { id: "3", name: "Blue Kurta",     category: "top",       color: "Blue",  bgColor: "#F8F7FC", occasion: "Casual", wears: 0,  isNew: true  },
  { id: "4", name: "Sneakers",       category: "footwear",  color: "White", bgColor: "#F8F7FC", occasion: "Casual", wears: 12, isNew: false },
  { id: "5", name: "Grey Blazer",    category: "outerwear", color: "Grey",  bgColor: "#F8F7FC", occasion: "Formal", wears: 0,  isNew: true  },
  { id: "6", name: "Beige Chinos",   category: "bottoms",   color: "Beige", bgColor: "#F8F7FC", occasion: "Casual", wears: 0,  isNew: true  },
];

const generateMockItems = (): ClothingItem[] => {
  const items = [...BASE_MOCK_ITEMS];
  const categories: CategoryId[] = ["top", "bottoms", "footwear", "outerwear", "dress", "ethnic", "accessory"];
  const names = ["Red T-Shirt", "Chino Pants", "Brown Boots", "Black Leather Jacket", "Summer Dress", "Sherwani", "Sunglasses", "Wool Scarf", "Silk Tie", "Running Shoes", "Jeans Jacket", "Cargo Shorts", "Hoodie", "Sweater"];
  for (let i = 7; i <= 48; i++) {
    const category = categories[i % categories.length];
    const wears = i % 4 === 0 ? 0 : Math.floor((i * 3) % 15) + 1;
    items.push({
      id: String(i),
      name: `${names[i % names.length]} #${i}`,
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

// Category filter chips with emoji
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
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      style={{ marginBottom: 20, maxHeight: 48 }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === active;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: isActive ? "#1D1A27" : "#F4F4F6",
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 13 }}>{cat.emoji}</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: isActive ? "#FFFFFF" : "#7E7C8C",
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

// Premium 4-stat summary card
const StatsCard = React.memo(function StatsCard({
  total, worn, unworn, usage,
}: {
  total: number; worn: number; unworn: number; usage: number;
}) {
  const stats = [
    { value: total,     label: "Total",  color: "#6366F1", bg: "#EEF2FF" },
    { value: worn,      label: "Worn",   color: "#10B981", bg: "#ECFDF5" },
    { value: unworn,    label: "Unworn", color: "#EF4444", bg: "#FEF2F2" },
    { value: `${usage}%`, label: "Usage", color: "#F59E0B", bg: "#FFFBEB" },
  ];

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#F0EEF8",
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: s.bg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "800", color: s.color }}>
                  {s.value}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: "#9B9BAF", fontWeight: "600" }}>
                {s.label}
              </Text>
            </View>
            {i < stats.length - 1 && (
              <View
                style={{
                  width: 1,
                  backgroundColor: "#F0EEF8",
                  marginVertical: 4,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
});

// View mode toggle
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
        backgroundColor: "#F4F4F6",
        borderRadius: 12,
        padding: 3,
      }}
    >
      {(["grouped", "grid"] as const).map((mode) => {
        const isActive = viewMode === mode;
        return (
          <Pressable
            key={mode}
            onPress={() => onToggle(mode)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: isActive ? "#000" : "transparent",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
              elevation: isActive ? 2 : 0,
            }}
          >
            {mode === "grouped" ? (
              <IconList size={17} color={isActive ? "#1D1A27" : "#9B9BAF"} strokeWidth={2} />
            ) : (
              <IconLayoutGrid size={17} color={isActive ? "#1D1A27" : "#9B9BAF"} strokeWidth={2} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
});

// 3-column grid clothing card
const ClothingCard = React.memo(function ClothingCard({ item }: { item: ClothingItem }) {
  const Icon = CATEGORY_ICONS[item.category] || IconHanger;
  const iconColor = CATEGORY_COLORS[item.category] || "#9B9BAF";
  const iconBg = CATEGORY_BG[item.category] || "#F4F4F6";
  const isWorn = item.wears > 0;

  return (
    <Pressable
      style={{
        width: CARD_WIDTH,
        marginBottom: GRID_GAP,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F0EEF8",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {/* Visual area */}
      <View
        style={{
          height: 110,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Worn/New badge */}
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: isWorn ? "#ECFDF5" : "#FEF2F2",
            borderRadius: 8,
            paddingHorizontal: 6,
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: "700",
              color: isWorn ? "#10B981" : "#EF4444",
            }}
          >
            {isWorn ? "WORN" : "NEW"}
          </Text>
        </View>

        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "rgba(255,255,255,0.8)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={26} color={iconColor} strokeWidth={1.5} />
        </View>
      </View>

      {/* Info area */}
      <View style={{ padding: 10 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 11, fontWeight: "700", color: "#1D1A27", marginBottom: 2 }}
        >
          {item.name}
        </Text>
        <Text numberOfLines={1} style={{ fontSize: 9, color: "#B0AFBE", fontWeight: "500" }}>
          {isWorn ? `${item.wears}× worn` : "Never worn"}
        </Text>
      </View>
    </Pressable>
  );
});

// Add cloth card for grid view
const AddClothCard = React.memo(function AddClothCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        marginBottom: GRID_GAP,
        height: 167,
        backgroundColor: "#FAFAFA",
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#E0DEFA",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#EEF2FF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconPlus size={18} color="#6366F1" strokeWidth={2.5} />
      </View>
      <Text style={{ fontSize: 11, fontWeight: "600", color: "#9B9BAF" }}>Add item</Text>
    </Pressable>
  );
});

// Carousel card for grouped view
const CarouselCard = React.memo(function CarouselCard({ item }: { item: ClothingItem }) {
  const Icon = CATEGORY_ICONS[item.category] || IconHanger;
  const iconColor = CATEGORY_COLORS[item.category] || "#9B9BAF";
  const iconBg = CATEGORY_BG[item.category] || "#F4F4F6";
  const isWorn = item.wears > 0;

  return (
    <Pressable
      style={{
        width: 116,
        marginRight: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F0EEF8",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View
        style={{
          height: 110,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: isWorn ? "#ECFDF5" : "#FEF2F2",
            borderRadius: 8,
            paddingHorizontal: 6,
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: "700",
              color: isWorn ? "#10B981" : "#EF4444",
            }}
          >
            {isWorn ? "WORN" : "NEW"}
          </Text>
        </View>

        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "rgba(255,255,255,0.8)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={26} color={iconColor} strokeWidth={1.5} />
        </View>
      </View>

      <View style={{ padding: 10 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 11, fontWeight: "700", color: "#1D1A27", marginBottom: 2 }}
        >
          {item.name}
        </Text>
        <Text numberOfLines={1} style={{ fontSize: 9, color: "#B0AFBE", fontWeight: "500" }}>
          {isWorn ? `${item.wears}× worn` : "Never worn"}
        </Text>
      </View>
    </Pressable>
  );
});

// Carousel add card
const CarouselAddCard = React.memo(function CarouselAddCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 116,
        height: 167,
        marginRight: 10,
        backgroundColor: "#FAFAFA",
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#E0DEFA",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#EEF2FF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconPlus size={18} color="#6366F1" strokeWidth={2.5} />
      </View>
      <Text style={{ fontSize: 11, fontWeight: "600", color: "#9B9BAF" }}>Add</Text>
    </Pressable>
  );
});

// Group section header
const GroupHeader = React.memo(function GroupHeader({
  category,
  count,
}: {
  category: CategoryChip;
  count: number;
}) {
  const color = CATEGORY_COLORS[category.id];
  const bg = CATEGORY_BG[category.id];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 8,
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>{category.emoji}</Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1D1A27" }}>
          {category.label}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: bg,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "700", color }}>
          {count} {count === 1 ? "item" : "items"}
        </Text>
      </View>
    </View>
  );
});

// AI suggestion banner at the bottom
const AISuggestionBanner = React.memo(function AISuggestionBanner({
  unworn,
}: {
  unworn: number;
}) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 24,
        padding: 16,
        backgroundColor: "#1D1A27",
        borderRadius: 24,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "rgba(99,102,241,0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconSparkles size={22} color="#818CF8" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
          {unworn} clothes never worn
        </Text>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>
          Get AI outfit ideas for them →
        </Text>
      </View>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.08)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconChevronRight size={16} color="rgba(255,255,255,0.5)" />
      </View>
    </Pressable>
  );
});

// Empty state
const EmptyState = React.memo(function EmptyState({ onAdd }: { onAdd: () => void }) {
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
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: "#EEF2FF",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <IconHanger size={40} color="#6366F1" strokeWidth={1.5} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: "800", color: "#1D1A27", marginBottom: 8 }}>
        Your wardrobe is empty
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: "#9B9BAF",
          textAlign: "center",
          lineHeight: 20,
          marginBottom: 24,
        }}
      >
        Start adding your clothes to track what you wear and get personalized AI outfit ideas.
      </Text>
      <Pressable
        onPress={onAdd}
        style={{
          backgroundColor: "#1D1A27",
          borderRadius: 20,
          paddingHorizontal: 28,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <IconPlus size={16} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>
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
      { id: "upload", name: "Add cloth", category: "all" as CategoryId, wears: 0, isNew: false, color: "", bgColor: "", occasion: "" },
      ...filteredItems,
    ];
  }, [filteredItems]);

  const groupableCategories = useMemo(() => {
    if (activeCategory !== "all") {
      return CATEGORIES.filter((cat) => cat.id === activeCategory);
    }
    return CATEGORIES.filter(
      (cat) => cat.id !== "all" && MOCK_ITEMS.some((item) => item.category === cat.id),
    );
  }, [activeCategory]);

  const total = MOCK_ITEMS.length;
  const worn = summary.totalWorn || MOCK_ITEMS.filter((i) => i.wears > 0).length;
  const unworn = summary.neverCount || MOCK_ITEMS.filter((i) => i.wears === 0).length;
  const usage = summary.wornPercentage
    ? Math.round(summary.wornPercentage * 100)
    : total > 0 ? Math.round((worn / total) * 100) : 0;

  const handleAddClothes = useCallback(() => {
    router.push("/(root)/add-clothes" as never);
  }, [router]);

  const handleCategorySelect = useCallback((id: CategoryId) => {
    setActiveCategory(id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.id === "upload") return <AddClothCard onPress={handleAddClothes} />;
      return <ClothingCard item={item} />;
    },
    [handleAddClothes],
  );

  const renderGroupedRow = useCallback(
    ({ item: category }: { item: CategoryChip }) => {
      const categoryItems = MOCK_ITEMS.filter((item) => item.category === category.id);
      return (
        <View style={{ marginBottom: 8 }}>
          <GroupHeader category={category} count={categoryItems.length} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <CarouselAddCard onPress={handleAddClothes} />
            {categoryItems.map((clothingItem) => (
              <CarouselCard key={clothingItem.id} item={clothingItem} />
            ))}
          </ScrollView>
        </View>
      );
    },
    [handleAddClothes],
  );

  const listHeader = (
    <View style={{ marginTop: 4 }}>
      {/* Stats */}
      <StatsCard total={total} worn={worn} unworn={unworn} usage={usage} />

      {/* Count & view toggle row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D1A27" }}>
            {viewMode === "grouped" ? "All Categories" : `${filteredItems.length} Items`}
          </Text>
          <Text style={{ fontSize: 12, color: "#9B9BAF", fontWeight: "500", marginTop: 2 }}>
            {viewMode === "grouped"
              ? `${total} items across ${groupableCategories.length} categories`
              : `Filtered: ${activeCategory === "all" ? "Everything" : CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          </Text>
        </View>
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
      </View>
    </View>
  );

  return (
    <SwipeTabWrapper tabIndex={1}>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>

          {/* ── Header ── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 16,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#9B9BAF",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 4,
                }}
              >
                My Closet
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: "#1D1A27",
                }}
              >
                Wardrobe
              </Text>
            </View>

            <Pressable
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#F4F4F6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSearch size={20} color="#1D1A27" strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* ── Category Filter ── */}
          <CategoryFilter active={activeCategory} onSelect={handleCategorySelect} />

          {/* ── Content ── */}
          {viewMode === "grid" ? (
            <FlatList
              key="grid-view"
              data={displayItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: GRID_GAP,
                paddingHorizontal: GRID_PADDING,
              }}
              contentContainerStyle={{ paddingBottom: 140 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={listHeader}
              ListEmptyComponent={<EmptyState onAdd={handleAddClothes} />}
              ListFooterComponent={
                filteredItems.length > 0 ? (
                  <AISuggestionBanner unworn={unworn} />
                ) : null
              }
            />
          ) : (
            <FlatList
              key="grouped-view"
              data={groupableCategories}
              keyExtractor={(cat) => cat.id}
              renderItem={renderGroupedRow}
              contentContainerStyle={{ paddingBottom: 140 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={listHeader}
              ListEmptyComponent={<EmptyState onAdd={handleAddClothes} />}
              ListFooterComponent={<AISuggestionBanner unworn={unworn} />}
            />
          )}

        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
