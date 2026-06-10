import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle } from "react-native-svg";
import {
  IconPlus,
  IconHanger,
  IconShirt,
  IconShoe,
  IconScissors,
  IconLayoutGrid,
  IconChevronRight,
  IconSparkles,
  IconList,
  IconHeart,
  IconCamera,
  IconPhoto,
  IconX,
} from "@tabler/icons-react-native";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { useWardrobeSummary } from "@/backend/hooks/useWardrobeSummary";
import { MOCK_WARDROBE_ITEMS } from "@/constants/mock-wardrobe-items";
import { useUserWardrobeStore } from "@/backend/store/user-wardrobe-store";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryId =
  | "all"
  | "top"
  | "bottoms"
  | "footwear"
  | "outerwear"
  | "dress"
  | "ethnic"
  | "accessory"
  | "activewear"
  | "sportswear"
  | "formal"
  | "casual"
  | "partywear"
  | "sleepwear"
  | "swimwear"
  | "winterwear"
  | "summerwear"
  | "loungewear"
  | "bags"
  | "jewelry"
  | "watches"
  | "sunglasses"
  | "belts"
  | "hats"
  | "co_ords"
  | "jumpsuits"
  | "blazers"
  | "hoodies"
  | "jackets"
  | "sweaters"
  | "jeans"
  | "trousers"
  | "shorts"
  | "skirts"
  | "traditional"
  | "festive"
  | "wedding"
  | "new_arrivals"
  | "trending"
  | "favorites"
  | "recommended";

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
const GRID_PADDING = 14;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

// Pinterest masonry heights — cycles for natural variation
const MASONRY_HEIGHTS = [
  230, 175, 260, 195, 210, 180, 250, 165, 240, 185, 220, 200,
];

const CATEGORIES: CategoryChip[] = [
  { id: "all", label: "All" },
  { id: "top", label: "Tops" },
  { id: "bottoms", label: "Bottom" },
  { id: "footwear", label: "Shoes" },
  { id: "outerwear", label: "Outer" },
  { id: "dress", label: "Dress" },
  { id: "ethnic", label: "Ethnic" },
  { id: "accessory", label: "Accessory" },
  { id: "activewear", label: "activewear" },
  { id: "sportswear", label: "sportswear" },
  { id: "formal", label: "formal" },
  { id: "casual", label: "casual" },
  { id: "partywear", label: "partywear" },
  { id: "sleepwear", label: "sleepwear" },
  { id: "swimwear", label: "swimwear" },
  { id: "winterwear", label: "winterwear" },
  { id: "summerwear", label: "summerwear" },
  { id: "loungewear", label: "loungewear" },
  { id: "bags", label: "bags" },
  { id: "jewelry", label: "jewelry" },
  { id: "watches", label: "watches" },
  { id: "sunglasses", label: "sunglasses" },
  { id: "belts", label: "belts" },
  { id: "hats", label: "hats" },
  { id: "co_ords", label: "co_ords" },
  { id: "jumpsuits", label: "jumpsuits" },
  { id: "blazers", label: "blazers" },
  { id: "hoodies", label: "hoodies" },
  { id: "jackets", label: "jackets" },
  { id: "sweaters", label: "sweaters" },
  { id: "jeans", label: "jeans" },
  { id: "trousers", label: "trousers" },
  { id: "shorts", label: "shorts" },
  { id: "skirts", label: "skirts" },
  { id: "traditional", label: "traditional" },
  { id: "festive", label: "festive" },
  { id: "wedding", label: "wedding" },
  { id: "new_arrivals", label: "new_arrivals" },
  { id: "trending", label: "trending" },
  { id: "favorites", label: "favorites" },
  { id: "recommended", label: "recommended" },
];

const CATEGORY_ICONS: Partial<Record<CategoryId, React.ComponentType<any>>> = {
  all: IconLayoutGrid,
  top: IconShirt,
  bottoms: IconScissors,
  footwear: IconShoe,
  outerwear: IconShirt,
  dress: IconShirt,
  ethnic: IconShirt,
  accessory: IconHanger,
  activewear: IconShirt,
  sportswear: IconShirt,
  formal: IconShirt,
  casual: IconShirt,
  partywear: IconShirt,
  sleepwear: IconShirt,
  swimwear: IconShirt,
  winterwear: IconShirt,
  summerwear: IconShirt,
  loungewear: IconShirt,
  bags: IconHanger,
  jewelry: IconHanger,
  watches: IconHanger,
  sunglasses: IconHanger,
  belts: IconHanger,
  hats: IconHanger,
  co_ords: IconShirt,
  jumpsuits: IconShirt,
  blazers: IconShirt,
  hoodies: IconShirt,
  jackets: IconShirt,
  sweaters: IconShirt,
  jeans: IconScissors,
  trousers: IconScissors,
  shorts: IconScissors,
  skirts: IconShirt,
  traditional: IconShirt,
  festive: IconShirt,
  wedding: IconShirt,
  new_arrivals: IconLayoutGrid,
  trending: IconLayoutGrid,
  favorites: IconHeart,
  recommended: IconSparkles,
};

const CATEGORY_COLORS: Partial<Record<CategoryId, string>> = {
  all: "#6366F1",
  top: "#10B981",
  bottoms: "#3B82F6",
  footwear: "#F59E0B",
  outerwear: "#8B5CF6",
  dress: "#EC4899",
  ethnic: "#EF4444",
  accessory: "#6B7280",
  activewear: "#10B981",
  sportswear: "#3B82F6",
  formal: "#1D1A27",
  casual: "#6366F1",
  partywear: "#EC4899",
  sleepwear: "#8B5CF6",
  swimwear: "#06B6D4",
  winterwear: "#3B82F6",
  summerwear: "#F59E0B",
  loungewear: "#8B5CF6",
  bags: "#6B7280",
  jewelry: "#F59E0B",
  watches: "#6B7280",
  sunglasses: "#1D1A27",
  belts: "#92400E",
  hats: "#6B7280",
  co_ords: "#EC4899",
  jumpsuits: "#8B5CF6",
  blazers: "#1D1A27",
  hoodies: "#6366F1",
  jackets: "#8B5CF6",
  sweaters: "#F59E0B",
  jeans: "#3B82F6",
  trousers: "#6B7280",
  shorts: "#10B981",
  skirts: "#EC4899",
  traditional: "#EF4444",
  festive: "#F59E0B",
  wedding: "#EC4899",
  new_arrivals: "#10B981",
  trending: "#EF4444",
  favorites: "#E11D48",
  recommended: "#6366F1",
};

const CATEGORY_BG: Partial<Record<CategoryId, string>> = {
  all: "#EEF2FF",
  top: "#ECFDF5",
  bottoms: "#EFF6FF",
  footwear: "#FFFBEB",
  outerwear: "#F5F3FF",
  dress: "#FDF2F8",
  ethnic: "#FFF1F2",
  accessory: "#F9FAFB",
  activewear: "#ECFDF5",
  sportswear: "#EFF6FF",
  formal: "#F1F1F5",
  casual: "#EEF2FF",
  partywear: "#FDF2F8",
  sleepwear: "#F5F3FF",
  swimwear: "#ECFEFF",
  winterwear: "#EFF6FF",
  summerwear: "#FFFBEB",
  loungewear: "#F5F3FF",
  bags: "#F9FAFB",
  jewelry: "#FFFBEB",
  watches: "#F9FAFB",
  sunglasses: "#F1F1F5",
  belts: "#FEF3C7",
  hats: "#F9FAFB",
  co_ords: "#FDF2F8",
  jumpsuits: "#F5F3FF",
  blazers: "#F1F1F5",
  hoodies: "#EEF2FF",
  jackets: "#F5F3FF",
  sweaters: "#FFFBEB",
  jeans: "#EFF6FF",
  trousers: "#F9FAFB",
  shorts: "#ECFDF5",
  skirts: "#FDF2F8",
  traditional: "#FFF1F2",
  festive: "#FFFBEB",
  wedding: "#FDF2F8",
  new_arrivals: "#ECFDF5",
  trending: "#FFF1F2",
  favorites: "#FFF1F2",
  recommended: "#EEF2FF",
};

const MOCK_ITEMS = MOCK_WARDROBE_ITEMS as ClothingItem[];

// ─── Sub-Components ──────────────────────────────────────────────────────────

// Category filter chips — smooth FlatList paging
const CHIP_PAGE_HEIGHT = 160;

const CategoryFilter = React.memo(function CategoryFilter({
  active,
  onSelect,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  // Split categories into 3 rows for a true "Brick Masonry" tight-packing layout
  const rows: CategoryChip[][] = [[], [], []];
  CATEGORIES.forEach((cat, index) => {
    rows[index % 3].push(cat);
  });

  const renderChip = (cat: CategoryChip) => {
    const isActive = cat.id === active;
    return (
      <Pressable
        key={cat.id}
        onPress={() => onSelect(cat.id)}
        style={{
          backgroundColor: isActive ? "#1D1A27" : "#EEF0F5",
          borderRadius: 25,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: isActive ? "600" : "500",
            color: isActive ? "#FFFFFF" : "#1D1A27",
          }}
        >
          {cat.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "column",
        gap: 5,
        paddingHorizontal: 20,
      }}
      style={{ marginBottom: 16 }}
    >
      <View style={{ flexDirection: "row", gap: 5 }}>
        {rows[0].map(renderChip)}
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {rows[1].map(renderChip)}
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {rows[2].map(renderChip)}
      </View>
    </ScrollView>
  );
});

// New 2x2 Stats Grid with Time Filters
const TIME_FILTERS = ["Today", "3day", "5day", "This week"];

const StatsCard = React.memo(function StatsCard({
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
  const [activeFilter, setActiveFilter] = useState("Today");

  // Mock data modifier based on filter to show interactivity
  const multiplier =
    activeFilter === "Today"
      ? 1
      : activeFilter === "3day"
        ? 1.5
        : activeFilter === "5day"
          ? 2
          : 2.5;

  // Adjusted values based on filter
  const displayTotal = total;
  const displayWorn = Math.min(Math.round(worn * multiplier), total);
  const displayUnworn = Math.max(total - displayWorn, 0);
  const displayUsage = total > 0 ? Math.round((displayWorn / total) * 100) : 0;

  // Usage logic: 'space remaining' or unused percentage
  const usageRemaining = 100 - displayUsage;
  const isUsageUp = usageRemaining >= 50;

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
      {/* Time Filter Tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F2F3F8",
          borderRadius: 24,
          padding: 4,
          marginBottom: 16,
        }}
      >
        {TIME_FILTERS.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 20,
              backgroundColor:
                activeFilter === filter ? "#FFFFFF" : "transparent",
              alignItems: "center",
              shadowColor: activeFilter === filter ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: activeFilter === filter ? 0.05 : 0,
              shadowRadius: 4,
              elevation: activeFilter === filter ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: activeFilter === filter ? "600" : "400",
                color: "#1D1A27",
              }}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 2x2 Grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {/* Usage Card */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: "#F4F5F9",
            borderRadius: 24,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 15, color: "#1D1A27", fontWeight: "400" }}>
              Usage
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: isUsageUp ? "#10B981" : "#EF4444",
                  marginRight: 2,
                }}
              >
                {isUsageUp ? "▲" : "▼"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: isUsageUp ? "#10B981" : "#EF4444",
                }}
              >
                {usageRemaining}%
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 44,
              fontWeight: "400",
              color: "#1D1A27",
              letterSpacing: -1,
            }}
          >
            {displayUsage}%
          </Text>
        </View>

        {/* Total Card */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: "#F4F5F9",
            borderRadius: 24,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 15, color: "#1D1A27", fontWeight: "400" }}>
              Total
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#10B981", marginRight: 2 }}>
                ▲
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#10B981",
                }}
              >
                54
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 44,
              fontWeight: "400",
              color: "#1D1A27",
              letterSpacing: -1,
            }}
          >
            {displayTotal}
          </Text>
        </View>

        {/* Worn Card */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: "#F4F5F9",
            borderRadius: 24,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 15, color: "#1D1A27", fontWeight: "400" }}>
              Worn
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#10B981", marginRight: 2 }}>
                ▲
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#10B981",
                }}
              >
                77
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 44,
              fontWeight: "400",
              color: "#1D1A27",
              letterSpacing: -1,
            }}
          >
            {displayWorn}
          </Text>
        </View>

        {/* Unworn Card */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: "#F4F5F9",
            borderRadius: 24,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 15, color: "#1D1A27", fontWeight: "400" }}>
              Unworn
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#10B981", marginRight: 2 }}>
                ▲
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#10B981",
                }}
              >
                90
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 44,
              fontWeight: "400",
              color: "#1D1A27",
              letterSpacing: -1,
            }}
          >
            {displayUnworn}
          </Text>
        </View>
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
  const isGrouped = viewMode === "grouped";

  return (
    <Pressable
      onPress={() => onToggle(isGrouped ? "grid" : "grouped")}
      style={{
        width: 48,
        height: 48,
        backgroundColor: "#F4F5F9",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isGrouped ? (
        <IconList size={24} color="#1D1A27" strokeWidth={2.5} />
      ) : (
        <IconLayoutGrid size={24} color="#1D1A27" strokeWidth={2.5} />
      )}
    </Pressable>
  );
});

// Pinterest-style masonry card — image only
const MasonryCard = React.memo(function MasonryCard({
  item,
  height,
}: {
  item: ClothingItem;
  height: number;
}) {
  const router = useRouter();
  const bg = CATEGORY_BG[item.category] || "#F0EEF8";
  return (
    <Pressable
      onPress={() => router.push(`/(root)/cloth-details/${item.id}` as never)}
      style={{
        width: "100%",
        height,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: GRID_GAP,
        backgroundColor: bg,
      }}
    >
      {/* Placeholder — swap with <Image source={{uri: item.imageUrl}} style={{flex:1}} /> when real photos available */}
      <View style={{ flex: 1, backgroundColor: bg }} />
    </Pressable>
  );
});

// Carousel card for grouped view
const CarouselCard = React.memo(function CarouselCard({
  item,
}: {
  item: ClothingItem;
}) {
  const router = useRouter();
  const bg = CATEGORY_BG[item.category] || "#F4F4F6";
  const isWorn = item.wears > 0;

  return (
    <Pressable
      onPress={() => router.push(`/(root)/cloth-details/${item.id}` as never)}
      style={{
        width: 180,
        height: 220,
        marginRight: 12,
        backgroundColor: bg,
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Placeholder — swap with <Image source={{uri: item.imageUrl}} style={{flex:1}} /> when real photos available */}
      <View style={{ flex: 1, backgroundColor: bg }} />
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
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#1D1A27" }}>
        {category.label}
      </Text>

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
        <Text
          style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}
        >
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
      <Text
        style={{
          fontSize: 18,
          fontWeight: "800",
          color: "#1D1A27",
          marginBottom: 8,
        }}
      >
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
        Start adding your clothes to track what you wear and get personalized AI
        outfit ideas.
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
  const userItems = useUserWardrobeStore((state) => state.items);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const allItems = useMemo(() => {
    const saved = userItems.map(
      (item): ClothingItem => ({
        id: item.id,
        name: item.name,
        category: item.category as CategoryId,
        color: item.color ?? "—",
        bgColor: "#F8F7FC",
        occasion: item.occasion ?? "Casual",
        wears: 0,
        isNew: true,
      }),
    );
    return [...saved, ...MOCK_ITEMS];
  }, [userItems]);

  const ADD_MENU_OPTIONS = [
    {
      id: "add_clothing",
      label: "Add Clothing",
      subtitle: "Upload a photo of your clothes",
      icon: IconShirt,
      color: "#6366F1",
      bg: "#EEF2FF",
      onPress: () => {
        setShowAddMenu(false);
        router.push("/(root)/add-clothes" as never);
      },
    },
    {
      id: "scan",
      label: "Scan & Add",
      subtitle: "Use camera to scan your clothing",
      icon: IconCamera,
      color: "#10B981",
      bg: "#ECFDF5",
      onPress: () => {
        setShowAddMenu(false);
        router.push("/(root)/add-clothes" as never);
      },
    },
    {
      id: "gallery",
      label: "Add from Gallery",
      subtitle: "Pick multiple items from photos",
      icon: IconPhoto,
      color: "#F59E0B",
      bg: "#FFFBEB",
      onPress: () => {
        setShowAddMenu(false);
        router.push("/(root)/add-clothes" as never);
      },
    },
    {
      id: "outfit",
      label: "Create Outfit",
      subtitle: "Combine pieces into an outfit",
      icon: IconHanger,
      color: "#EC4899",
      bg: "#FDF2F8",
      onPress: () => {
        setShowAddMenu(false);
      },
    },
  ];
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [viewMode, setViewMode] = useState<"grouped" | "grid">("grouped");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return allItems;
    return allItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, allItems]);

  const displayItems = useMemo(() => filteredItems, [filteredItems]);

  const groupableCategories = useMemo(() => {
    if (activeCategory !== "all") {
      return CATEGORIES.filter((cat) => cat.id === activeCategory);
    }
    return CATEGORIES.filter(
      (cat) =>
        cat.id !== "all" && allItems.some((item) => item.category === cat.id),
    );
  }, [activeCategory]);

  const total = allItems.length;
  const worn =
    summary.totalWorn || allItems.filter((i) => i.wears > 0).length;
  const unworn =
    summary.neverCount || allItems.filter((i) => i.wears === 0).length;
  const usage = summary.wornPercentage
    ? Math.round(summary.wornPercentage * 100)
    : total > 0
      ? Math.round((worn / total) * 100)
      : 0;

  const handleAddClothes = useCallback(() => {
    router.push("/(root)/add-clothes" as never);
  }, [router]);

  const handleSaved = useCallback(() => {
    router.push("/(root)/saved" as never);
  }, [router]);

  const handleCategorySelect = useCallback((id: CategoryId) => {
    setActiveCategory(id);
  }, []);

  const renderGroupedRow = useCallback(
    ({ item: category }: { item: CategoryChip }) => {
      const categoryItems = allItems.filter(
        (item) => item.category === category.id,
      );
      return (
        <View style={{ marginBottom: 8 }}>
          {activeCategory === "all" && (
            <GroupHeader category={category} count={categoryItems.length} />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {categoryItems.map((clothingItem) => (
              <CarouselCard key={clothingItem.id} item={clothingItem} />
            ))}
          </ScrollView>
        </View>
      );
    },
    [activeCategory, allItems],
  );

  const listHeader = (
    <View style={{ marginTop: 4 }}>
      {/* Stats Banner — on top */}
      <StatsCard total={total} worn={worn} unworn={unworn} usage={usage} />

      {/* Category Filter chips — below banner */}
      <CategoryFilter active={activeCategory} onSelect={handleCategorySelect} />

      {/* Count & view toggle row */}
      {activeCategory === "all" && (
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1D1A27" }}>
              All Categories
            </Text>
          </View>
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </View>
      )}
    </View>
  );

  return (
    <SwipeTabWrapper tabIndex={1}>
      <AppGradientBackground>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          {/* ── Header ── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              // paddingTop: 10,
              paddingBottom: 15,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "500",
                  color: "#000000",
                }}
              >
                Wardrobe
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {/* Add Button */}
              <Pressable
                onPress={() => setShowAddMenu(true)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#1D1A27",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconPlus size={20} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>

              {/* Saved / Heart Button */}
              <Pressable
                onPress={handleSaved}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#EEF0F5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconHeart size={20} color="#000000" strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          {/* ── Add Menu Modal ── */}
          <Modal
            visible={showAddMenu}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAddMenu(false)}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "flex-end",
              }}
              onPress={() => setShowAddMenu(false)}
            >
              <Pressable onPress={() => {}}>
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    paddingTop: 12,
                    paddingBottom: 40,
                    paddingHorizontal: 20,
                  }}
                >
                  {/* Handle bar */}
                  <View
                    style={{
                      width: 40,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#E0E0E8",
                      alignSelf: "center",
                      marginBottom: 20,
                    }}
                  />

                  {/* Title row */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#1D1A27",
                      }}
                    >
                      Add to Wardrobe
                    </Text>
                    <Pressable onPress={() => setShowAddMenu(false)}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: "#EEF0F5",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconX size={16} color="#1D1A27" strokeWidth={2.5} />
                      </View>
                    </Pressable>
                  </View>

                  {/* Options */}
                  {ADD_MENU_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={opt.onPress}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 16,
                          paddingVertical: 14,
                          borderBottomWidth: 1,
                          borderBottomColor: "#F4F4F8",
                        }}
                      >
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 16,
                            backgroundColor: opt.bg,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={22} color={opt.color} strokeWidth={2} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "600",
                              color: "#1D1A27",
                            }}
                          >
                            {opt.label}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#9B9BAF",
                              marginTop: 2,
                            }}
                          >
                            {opt.subtitle}
                          </Text>
                        </View>
                        <IconChevronRight
                          size={18}
                          color="#C0C0CC"
                          strokeWidth={2}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </Pressable>
            </Pressable>
          </Modal>

          {/* ── Content ── */}
          {viewMode === "grid" || activeCategory !== "all" ? (
            <ScrollView
              key="grid-view"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 140 }}
            >
              {listHeader}

              {displayItems.length === 0 ? (
                <EmptyState onAdd={handleAddClothes} />
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: GRID_PADDING,
                    gap: GRID_GAP,
                  }}
                >
                  {/* Left column */}
                  <View style={{ flex: 1 }}>
                    {displayItems
                      .filter((_, i) => i % 2 === 0)
                      .map((item, i) => (
                        <MasonryCard
                          key={item.id}
                          item={item}
                          height={
                            MASONRY_HEIGHTS[(i * 2) % MASONRY_HEIGHTS.length]
                          }
                        />
                      ))}
                  </View>

                  {/* Right column — offset down for Pinterest stagger */}
                  <View style={{ flex: 1, marginTop: 32 }}>
                    {displayItems
                      .filter((_, i) => i % 2 === 1)
                      .map((item, i) => (
                        <MasonryCard
                          key={item.id}
                          item={item}
                          height={
                            MASONRY_HEIGHTS[
                              (i * 2 + 1) % MASONRY_HEIGHTS.length
                            ]
                          }
                        />
                      ))}
                  </View>
                </View>
              )}
            </ScrollView>
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
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              windowSize={5}
              initialNumToRender={3}
            />
          )}
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
