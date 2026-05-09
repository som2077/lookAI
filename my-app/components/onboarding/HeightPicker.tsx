import { useRef } from "react";
import { FlatList, Text, View, ViewToken } from "react-native";

const HEIGHT_MIN = 140;
const HEIGHT_MAX = 210;
const HEIGHT_ITEM_HEIGHT = 52;
const values = Array.from({ length: HEIGHT_MAX - HEIGHT_MIN + 1 }, (_, idx) => HEIGHT_MIN + idx);

export function HeightPicker({ height, onChange }: { height: number; onChange: (value: number) => void }) {
  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const centered = viewableItems.find((item) => item.isViewable && item.item != null);
    if (centered?.item) onChange(centered.item as number);
  }).current;

  return (
    <View className="flex-1 items-center">
      <View className="mt-10 flex-row items-end">
        <Text className="text-7xl font-bold text-black">{height}</Text>
        <Text className="mb-2 ml-1 text-3xl font-semibold text-[#4A4656]">cm</Text>
      </View>
      <View className="relative mt-8 h-[300px] w-[116px] overflow-hidden rounded-2xl bg-[#A89AF4] py-2">
        <FlatList
          data={values}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={HEIGHT_ITEM_HEIGHT}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{ paddingVertical: 124 }}
          getItemLayout={(_, index) => ({ length: HEIGHT_ITEM_HEIGHT, offset: HEIGHT_ITEM_HEIGHT * index, index })}
          initialScrollIndex={height - HEIGHT_MIN}
          viewabilityConfig={{ itemVisiblePercentThreshold: 65 }}
          onViewableItemsChanged={onViewable}
          renderItem={({ item }) => (
            <View className="h-[52px] items-center justify-center">
              <Text className={`${item === height ? "text-4xl font-bold text-black" : "text-3xl font-semibold text-[#6E6A79]"}`}>{item}</Text>
            </View>
          )}
        />
        <View pointerEvents="none" className="absolute left-0 right-0 top-1/2 -mt-[1px] h-[2px] bg-[#D4DD56]" />
      </View>
      <Text className="absolute right-[70px] top-[220px] text-2xl text-[#D4DD56]">◀</Text>
    </View>
  );
}
