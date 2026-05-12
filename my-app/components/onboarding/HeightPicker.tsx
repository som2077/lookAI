import { useRef } from "react";
import { Dimensions, FlatList, Text, View, ViewToken } from "react-native";

const HEIGHT_MIN = 140;
const HEIGHT_MAX = 210;
const HEIGHT_ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 7; // kitne items ek waqt dikhenge
const RULER_HEIGHT = HEIGHT_ITEM_HEIGHT * VISIBLE_ITEMS;
const values = Array.from(
  { length: HEIGHT_MAX - HEIGHT_MIN + 1 },
  (_, idx) => HEIGHT_MAX - idx // upar se neeche: bada se chhota
);

export function HeightPicker({
  height,
  onChange,
}: {
  height: number;
  onChange: (value: number) => void;
}) {
  const onViewable = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const centered = viewableItems.find(
        (item) => item.isViewable && item.item != null
      );
      if (centered?.item != null) onChange(centered.item as number);
    }
  ).current;

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {/* Big number display */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 32 }}>
        <Text style={{ fontSize: 72, fontWeight: "800", color: "#1D1A27", lineHeight: 80 }}>
          {height}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "600", color: "#6E6A79", marginBottom: 10, marginLeft: 4 }}>
          cm
        </Text>
      </View>

      {/* Ruler + labels row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 32,
        }}
      >
        {/* Left: number labels */}
        <View style={{ width: 52, height: RULER_HEIGHT, justifyContent: "space-between", alignItems: "flex-end", paddingRight: 10 }}>
          {[height + Math.floor(VISIBLE_ITEMS / 2), height + Math.floor(VISIBLE_ITEMS / 2) - 1, height, height - 1, height - Math.floor(VISIBLE_ITEMS / 2)].map((val, i) => (
            <Text
              key={i}
              style={{
                fontSize: val === height ? 20 : 14,
                fontWeight: val === height ? "700" : "400",
                color: val === height ? "#1D1A27" : "#9B97A6",
                lineHeight: HEIGHT_ITEM_HEIGHT,
              }}
            >
              {val}
            </Text>
          ))}
        </View>

        {/* Purple ruler column */}
        <View
          style={{
            width: 80,
            height: RULER_HEIGHT,
            backgroundColor: "#B8ADEE",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <FlatList
            data={values}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={HEIGHT_ITEM_HEIGHT}
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{
              paddingVertical: HEIGHT_ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
            }}
            getItemLayout={(_, index) => ({
              length: HEIGHT_ITEM_HEIGHT,
              offset: HEIGHT_ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={HEIGHT_MAX - height}
            viewabilityConfig={{ itemVisiblePercentThreshold: 65 }}
            onViewableItemsChanged={onViewable}
            renderItem={({ item }) => (
              <View
                style={{
                  height: HEIGHT_ITEM_HEIGHT,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingRight: 10,
                }}
              >
                {/* Tick marks — longer for selected */}
                <View
                  style={{
                    height: item === height ? 2 : 1,
                    width: item === height ? 28 : item % 5 === 0 ? 20 : 14,
                    backgroundColor:
                      item === height
                        ? "#D4DD56"
                        : "rgba(255,255,255,0.75)",
                    borderRadius: 2,
                  }}
                />
              </View>
            )}
          />
        </View>

        {/* Arrow pointing left at selected line */}
        <Text
          style={{
            fontSize: 20,
            color: "#D4DD56",
            marginLeft: 6,
          }}
        >
          ◀
        </Text>
      </View>
    </View>
  );
}