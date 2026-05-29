import React from "react";
import { Text } from "react-native";

export const RecentlyUploadedHeading = React.memo(
  function RecentlyUploadedHeading() {
    return (
      <Text className="text-[#1D1A27] text-lg font-bold mx-8 mt-4">
        Recently Styled
      </Text>
    );
  },
);
