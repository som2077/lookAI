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

// ─── Mock Data ────────────────────────────────────────────────────────────────

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

// Category filter chips — smooth FlatList paging
const CHIP_PAGE_HEIGHT = 170;

const CategoryFilter = React.memo(function CategoryFilter({
  active,
  onSelect,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<any>(null);
  const itemsPerPage = 9;

  const chunkedCategories = useMemo(() => {
    const chunks: CategoryChip[][] = [];
    for (let i = 0; i < CATEGORIES.length; i += itemsPerPage) {
      chunks.push(CATEGORIES.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, []);

  const pages = chunkedCategories.length;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 51,
  }).current;

  const goToPage = useCallback((idx: number) => {
    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
    setCurrentPage(idx);
  }, []);

  const renderPage = useCallback(
    ({ item: chunk }: { item: CategoryChip[] }) => (
      <View
        style={{
          width: SCREEN_WIDTH,
          height: CHIP_PAGE_HEIGHT,
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "center",
          gap: 7,
          paddingHorizontal: 20,
          paddingVertical: 2,
        }}
      >
        {chunk.map((cat) => {
          const isActive = cat.id === active;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              style={{
                backgroundColor: isActive ? "#1D1A27" : "#EEF0F5",
                borderRadius: 25,
                paddingHorizontal: 25,
                paddingVertical: 13,
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
        })}
      </View>
    ),
    [active, onSelect],
  );

  return (
    <View style={{ alignItems: "center", marginBottom: 16 }}>
      <FlatList
        ref={flatListRef}
        data={chunkedCategories}
        keyExtractor={(_, i) => `page-${i}`}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={{ width: SCREEN_WIDTH, height: CHIP_PAGE_HEIGHT }}
      />

      {/* Pagination dots */}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 12 }}>
        {Array.from({ length: pages }).map((_, idx) => (
          <Pressable key={idx} onPress={() => goToPage(idx)}>
            <View
              style={{
                width: idx === currentPage ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  idx === currentPage ? "#1D1A27" : "transparent",
                borderWidth: idx === currentPage ? 0 : 1,
                borderColor: "#B0AFBE",
              }}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
});

// Half-Ring Stats Card
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
  const R = 82;
  const SW = 15;
  const CX = 110;
  const CY = R + SW / 2 + 2;
  const SVG_W = 220;
  const SVG_H = CY + 4;
  const halfCirc = Math.PI * R;
  const fullCirc = 2 * Math.PI * R;
  const progress = Math.min(Math.max(usage / 100, 0), 1);
  const dashOffset = halfCirc * (1 - progress);

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: "#F8F7FC",
        borderWidth: 1,
        borderColor: "#E9EBF8",
        borderRadius: 28,
        paddingTop: 24,
        paddingBottom: 20,
        alignItems: "center",
      }}
    >
      {/* Half Ring SVG */}
      <View style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <Svg width={SVG_W} height={SVG_H}>
          {/* Track */}
          <Circle
            cx={CX}
            cy={CY}
            r={R}
            stroke="#FFFFFF"
            strokeWidth={SW}
            fill="none"
            strokeDasharray={`${halfCirc} ${fullCirc}`}
            strokeLinecap="round"
            transform={`rotate(180, ${CX}, ${CY})`}
          />
          {/* Progress */}
          <Circle
            cx={CX}
            cy={CY}
            r={R}
            stroke="#1D1A27"
            strokeWidth={SW}
            fill="none"
            strokeDasharray={`${halfCirc} ${fullCirc}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(180, ${CX}, ${CY})`}
          />
        </Svg>

        {/* Center label — sits inside the arc */}
        <View
          style={{
            position: "absolute",
            bottom: 2,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: "#1D1A27",
              lineHeight: 34,
            }}
          >
            {usage}%
          </Text>
          <Text style={{ fontSize: 12, color: "#9B9BAF", fontWeight: "600" }}>
            Usage
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 16,
          gap: 0,
        }}
      >
        {/* Worn */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1D1A27" }}>
            {worn}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#9B9BAF",
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            Worn
          </Text>
        </View>

        {/* Divider */}
        <View style={{ width: 2, height: 30, backgroundColor: "#FFFFFF" }} />

        {/* Total */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1D1A27" }}>
            {total}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#9B9BAF",
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            Total
          </Text>
        </View>

        {/* Divider */}
        <View style={{ width: 2, height: 30, backgroundColor: "#FFFFFF" }} />

        {/* Unworn */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1D1A27" }}>
            {unworn}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#9B9BAF",
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            Unworn
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
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#EEF0F5",
        borderRadius: 12,
        padding: 4,
      }}
    >
      {(["grouped", "grid"] as const).map((mode) => {
        const isActive = viewMode === mode;
        const isGrouped = mode === "grouped";
        const bgColor = isActive
          ? isGrouped
            ? "#000000"
            : "#FFFFFF"
          : "transparent";
        const iconColor = isActive
          ? isGrouped
            ? "#FFFFFF"
            : "#1D1A27"
          : "#000000";

        return (
          <Pressable
            key={mode}
            onPress={() => onToggle(mode)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: bgColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isGrouped ? (
              <IconList size={17} color={iconColor} strokeWidth={2} />
            ) : (
              <IconLayoutGrid size={17} color={iconColor} strokeWidth={2} />
            )}
          </Pressable>
        );
      })}
    </View>
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
  const bg = CATEGORY_BG[item.category] || "#F0EEF8";
  return (
    <Pressable
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
      </View>

      <View style={{ padding: 10 }}>
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
          style={{ fontSize: 9, color: "#B0AFBE", fontWeight: "500" }}
        >
          {isWorn ? `${item.wears}× worn` : "Never worn"}
        </Text>
      </View>
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
  const [showAddMenu, setShowAddMenu] = useState(false);

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
    if (activeCategory === "all") return MOCK_ITEMS;
    return MOCK_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const displayItems = useMemo(() => filteredItems, [filteredItems]);

  const groupableCategories = useMemo(() => {
    if (activeCategory !== "all") {
      return CATEGORIES.filter((cat) => cat.id === activeCategory);
    }
    return CATEGORIES.filter(
      (cat) =>
        cat.id !== "all" && MOCK_ITEMS.some((item) => item.category === cat.id),
    );
  }, [activeCategory]);

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
      const categoryItems = MOCK_ITEMS.filter(
        (item) => item.category === category.id,
      );
      return (
        <View style={{ marginBottom: 8 }}>
          <GroupHeader category={category} count={categoryItems.length} />
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
    [],
  );

  const listHeader = (
    <View style={{ marginTop: 4 }}>
      {/* Stats Banner — on top */}
      <StatsCard total={total} worn={worn} unworn={unworn} usage={usage} />

      {/* Category Filter chips — below banner */}
      <CategoryFilter active={activeCategory} onSelect={handleCategorySelect} />

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
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#1D1A27" }}>
            {activeCategory === "all"
              ? "All Categories"
              : (CATEGORIES.find((c) => c.id === activeCategory)?.label ??
                "All Categories")}
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
          {viewMode === "grid" ? (
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

              {filteredItems.length > 0 && (
                <AISuggestionBanner unworn={unworn} />
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
              ListFooterComponent={<AISuggestionBanner unworn={unworn} />}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              windowSize={5}
              initialNumToRender={3}
            />
          )}
        </SafeAreaView>
      </View>
    </SwipeTabWrapper>
  );
}
