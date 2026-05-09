import { useRef } from "react";
import { Dimensions, FlatList, Text, View, ViewToken } from "react-native";

const AGE_MIN = 13;
const AGE_MAX = 70;
const AGE_ITEM_WIDTH = 96;
const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, idx) => AGE_MIN + idx);

export function AgePicker({ age, onChange }: { age: number; onChange: (value: number) => void }) {
  const sideSpacer = (Dimensions.get("window").width - AGE_ITEM_WIDTH) / 2;
  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const centered = viewableItems.find((item) => item.isViewable && item.item != null);
    if (centered?.item) onChange(centered.item as number);
  }).current;

  return (
    <>
      <View className="mt-24 items-center">
        <Text className="text-7xl font-semibold text-black">{age}</Text>
        <Text className="mt-2 text-3xl text-[#D4DD56]">▲</Text>
      </View>
      <View className="mt-4 overflow-hidden rounded-2xl bg-[#A89AF4] py-5">
        <FlatList
          data={ages}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={AGE_ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{ paddingHorizontal: sideSpacer }}
          getItemLayout={(_, index) => ({ length: AGE_ITEM_WIDTH, offset: AGE_ITEM_WIDTH * index, index })}
          initialScrollIndex={age - AGE_MIN}
          viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
          onViewableItemsChanged={onViewable}
          renderItem={({ item }) => (
            <View className="items-center justify-center" style={{ width: AGE_ITEM_WIDTH }}>
              <Text className={`font-semibold ${item === age ? "text-5xl text-white" : "text-4xl text-[#5F52A2]"}`}>{item}</Text>
            </View>
          )}
        />
        <View pointerEvents="none" className="absolute inset-y-0 items-center justify-center border-x border-white/50" style={{ width: AGE_ITEM_WIDTH, left: sideSpacer }} />
      </View>
    </>
  );
}
