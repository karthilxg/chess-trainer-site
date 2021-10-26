import { c } from "@src/styles";
import React from "react";
import { Pressable, View, Text } from "react-native";

export const Button = ({ onPress, style, children }) => {
  let inner = children;
  if (typeof inner === "string") {
    inner = <Text style={style.textStyles}>{inner}</Text>;
  }
  return (
    <Pressable style={style} onPress={onPress}>
      {inner}
    </Pressable>
  );
};
