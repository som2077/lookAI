import { useRef } from "react";
import { Dimensions, FlatList, Text, View, ViewToken } from "react-native";

const AGE_MIN = 13;
const AGE_MAX = 70;
const AGE_ITEM_WIDTH = 96;
const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, idx) => AGE_MIN + idx);

export function AgePicker({ age, onChange }: { age: number; onChange: (value: number) => void }) {
  const { width } = Dimensions.get("window");
  const sideSpacer = (width - AGE_ITEM_WIDTH) / 2;

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const centered = viewableItems.find((item) => item.isViewable && item.item != null);
    if (centered?.item != null) onChange(centered.item as number);
  }).current;

  return (
    <>
      {/* Big number + arrow above picker */}
      <View className="items-center">
        <Text style={{ fontSize: 80, fontWeight: "700", color: "#1D1A27", lineHeight: 88 }}>
          {age}
        </Text>
        {/* ▲ arrow pointing down toward the picker strip */}
        <Text style={{ fontSize: 14, color: "#C8D44A", marginTop: 4, lineHeight: 16 }}>▲</Text>
      </View>

      {/* Picker strip — full width, no horizontal padding */}
      <View style={{ marginTop: 8, backgroundColor: "#B8ADEE", paddingVertical: 18, overflow: "hidden" }}>
        <FlatList
          data={ages}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={AGE_ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{ paddingHorizontal: sideSpacer }}
          getItemLayout={(_, index) => ({
            length: AGE_ITEM_WIDTH,
            offset: AGE_ITEM_WIDTH * index,
            index,
          })}
          initialScrollIndex={age - AGE_MIN}
          viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
          onViewableItemsChanged={onViewable}
          renderItem={({ item }) => {
            const isSelected = item === age;
            return (
              <View style={{ width: AGE_ITEM_WIDTH, alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: isSelected ? 34 : 26,
                    fontWeight: isSelected ? "700" : "500",
                    color: isSelected ? "#FFFFFF" : "#7B6EC4",
                  }}
                >
                  {item}
                </Text>
              </View>
            );
          }}
        />

        {/* Selected cell highlight */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: sideSpacer,
            width: AGE_ITEM_WIDTH,
            backgroundColor: "rgba(255,255,255,0.18)",
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "rgba(255,255,255,0.5)",
          }}
        />
      </View>
    </>
  );
}