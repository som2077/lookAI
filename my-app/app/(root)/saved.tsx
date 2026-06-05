import React, { useCallback } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  IconArrowLeft,
  IconHeart,
  IconHanger,
  IconShirt,
  IconShoe,
  IconScissors,
} from "@tabler/icons-react-native";

// ─── Mock saved items ─────────────────────────────────────────────────────────

const SAVED_ITEMS = [
  { id: "1", name: "White Linen Shirt",  category: "Tops",    color: "#F0FDFA", accent: "#0D9488", emoji: "👕", tag: "Summer fav" },
  { id: "2", name: "Black Slim Jeans",   category: "Bottoms", color: "#EFF6FF", accent: "#3B82F6", emoji: "👖", tag: "Daily wear" },
  { id: "3", name: "Beige Blazer",       category: "Outer",   color: "#FFFBEB", accent: "#D97706", emoji: "🧥", tag: "Office look" },
  { id: "4", name: "White Sneakers",     category: "Shoes",   color: "#F5F3FF", accent: "#7C3AED", emoji: "👟", tag: "Go-to pair" },
  { id: "5", name: "Navy Blue Kurta",    category: "Ethnic",  color: "#EEF2FF", accent: "#4F46E5", emoji: "🎽", tag: "Festival" },
  { id: "6", name: "Cargo Shorts",       category: "Bottoms", color: "#FFF1F2", accent: "#E11D48", emoji: "🩳", tag: "Casual" },
];

const CATEGORY_ICON: Record<string, React.ComponentType<any>> = {
  Tops:    IconShirt,
  Bottoms: IconScissors,
  Shoes:   IconShoe,
  Outer:   IconShirt,
  Ethnic:  IconHanger,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SavedScreen() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(root)/(tabs)/wardrobe" as never);
  }, [router]);

  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={s.safe} edges={["top", "bottom"]}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <View style={s.header}>
          <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
            <IconArrowLeft size={18} color="#111827" strokeWidth={2.2} />
          </Pressable>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Saved</Text>
          </View>
          <View style={s.headerSpacer} />
        </View>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <IconHeart size={28} color="#E11D48" strokeWidth={1.8} fill="#E11D48" />
          </View>
          <Text style={s.heroTitle}>Your Saved Items</Text>
          <Text style={s.heroSub}>{SAVED_ITEMS.length} items saved to your favourites</Text>
        </View>

        {/* ── Items ────────────────────────────────────────────────── */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SAVED_ITEMS.map((item, i) => {
            const Icon = CATEGORY_ICON[item.category] ?? IconHanger;
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [s.card, pressed && s.cardPressed]}
              >
                {/* Icon */}
                <View style={[s.cardIcon, { backgroundColor: item.color }]}>
                  <Icon size={24} color={item.accent} strokeWidth={1.7} />
                </View>

                {/* Info */}
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{item.name}</Text>
                  <View style={s.cardMeta}>
                    <View style={[s.categoryBadge, { backgroundColor: item.color }]}>
                      <Text style={[s.categoryText, { color: item.accent }]}>
                        {item.category}
                      </Text>
                    </View>
                    <Text style={s.cardTag}>· {item.tag}</Text>
                  </View>
                </View>

                {/* Heart */}
                <IconHeart size={18} color="#FDA4AF" strokeWidth={2} fill="#FDA4AF" />
              </Pressable>
            );
          })}

          {/* ── Empty state if no items ── */}
          {SAVED_ITEMS.length === 0 && (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <IconHeart size={36} color="#FDA4AF" strokeWidth={1.5} />
              </View>
              <Text style={s.emptyTitle}>Nothing saved yet</Text>
              <Text style={s.emptySub}>
                Tap the heart on any item in your wardrobe to save it here.
              </Text>
            </View>
          )}
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  headerSpacer: { width: 38 },

  // Hero
  hero: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSub: {
    color: "#9CA3AF",
    fontSize: 13,
  },

  // List
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 10 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardPressed: { backgroundColor: "#FAFAFA" },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: { fontSize: 10, fontWeight: "700" },
  cardTag: { color: "#9CA3AF", fontSize: 11 },

  // Empty
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySub: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
