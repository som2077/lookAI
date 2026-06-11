import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeTabWrapper } from "../../../components/navigation/SwipeTabWrapper";
import { AppGradientBackground } from "../../../components/ui/AppGradientBackground";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { IconSearch, IconFlame, IconSparkles, IconTrendingUp } from "@tabler/icons-react-native";
import { useState } from "react";

const CATEGORIES = ["All", "Streetwear", "Minimalist", "Vintage", "Formal", "Y2K", "Athleisure"];

const TRENDING_OUTFITS = [
  { id: 1, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", title: "Urban Chic", likes: "2.4k" },
  { id: 2, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80", title: "Summer Breeze", likes: "1.8k" },
  { id: 3, image: "https://images.unsplash.com/photo-1434389678232-068a8ebce4ea?w=500&q=80", title: "Minimalist Fall", likes: "3.2k" },
  { id: 4, image: "https://images.unsplash.com/photo-1550614000-4b95d466f289?w=500&q=80", title: "Oversized Fit", likes: "4.1k" },
];

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <SwipeTabWrapper tabIndex={2}>
      <AppGradientBackground>
        <StatusBar style="dark" />
        <SafeAreaView className="flex-1" edges={["top"]}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-6 pt-6 pb-4">
              <Text className="text-3xl font-bold text-[#1D1A27] tracking-tight">Explore</Text>
              <Text className="text-[#6B7280] text-base mt-1">Discover your next signature look</Text>
            </View>

            {/* Search Bar */}
            <View className="px-6 mb-6">
              <View className="flex-row items-center bg-white/60 border border-white/40 rounded-2xl px-4 py-3 shadow-sm overflow-hidden">
                <IconSearch size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="Search styles, brands, or users..." 
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-3 text-[#1D1A27] font-medium text-base"
                />
              </View>
            </View>

            {/* Categories (Horizontal) */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              className="pl-6 mb-8"
              contentContainerStyle={{ paddingRight: 40 }}
            >
              {CATEGORIES.map((category, index) => (
                <Pressable
                  key={index}
                  onPress={() => setActiveCategory(category)}
                  className={`mr-3 px-5 py-2.5 rounded-full border ${
                    activeCategory === category 
                      ? "bg-[#1D1A27] border-[#1D1A27]" 
                      : "bg-white/40 border-white/60"
                  }`}
                >
                  <Text 
                    className={`font-semibold ${
                      activeCategory === category ? "text-white" : "text-[#4B5563]"
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* AI Curated Hero */}
            <View className="px-6 mb-10">
              <View className="flex-row items-center mb-4">
                <IconSparkles size={20} color="#8B5CF6" />
                <Text className="text-lg font-bold text-[#1D1A27] ml-2">AI Curated For You</Text>
              </View>
              
              <Pressable className="w-full h-64 rounded-3xl overflow-hidden relative shadow-md border border-white/20">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" }}
                  className="w-full h-full"
                  contentFit="cover"
                />
                <View className="absolute inset-0 bg-black/30 justify-end p-6">
                  <View className="bg-white/20 self-start px-3 py-1.5 rounded-full mb-2 border border-white/30">
                    <Text className="text-white text-xs font-bold tracking-wider uppercase">Style Match 98%</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold mb-1 shadow-sm">Autumn Essentials</Text>
                  <Text className="text-white/80 text-sm font-medium">12 items perfectly matched to your wardrobe</Text>
                </View>
              </Pressable>
            </View>

            {/* Trending Section */}
            <View className="px-6 mb-32">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <IconFlame size={20} color="#EF4444" />
                  <Text className="text-lg font-bold text-[#1D1A27] ml-2">Trending Now</Text>
                </View>
                <Pressable>
                  <Text className="text-[#6B7280] font-semibold text-sm">See All</Text>
                </Pressable>
              </View>
              
              <View className="flex-row flex-wrap justify-between">
                {TRENDING_OUTFITS.map((outfit) => (
                  <Pressable key={outfit.id} className="w-[48%] mb-5">
                    <View className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-2 bg-white/50 border border-white/40 shadow-sm relative">
                      <Image 
                        source={{ uri: outfit.image }}
                        className="w-full h-full"
                        contentFit="cover"
                        transition={300}
                      />
                      <View className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded-full flex-row items-center">
                        <IconTrendingUp size={12} color="#1D1A27" />
                        <Text className="text-[#1D1A27] text-xs font-bold ml-1">{outfit.likes}</Text>
                      </View>
                    </View>
                    <Text className="text-[#1D1A27] font-bold text-sm px-1">{outfit.title}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </AppGradientBackground>
    </SwipeTabWrapper>
  );
}
