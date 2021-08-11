import React from "react";
import { View } from "react-native";

export default function Component({ width = 0, height = 0, grow = false }) {
  return <View style={{ width: width, height, flexGrow: grow ? 1 : 0 }}></View>;
}
