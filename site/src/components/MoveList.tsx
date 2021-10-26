import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  Text,
} from "react-native";
import { s, c } from "@src/styles";
import { times } from "@src/utils";
import { forEach, isEmpty, cloneDeep, takeRight, first } from "lodash";
import client from "@src/client";
import { Space } from "@src/Space";
import { Move } from "chess.js";

export const MoveList = ({
  moveList,
  focusedMoveIndex,
  onMoveClick,
}: {
  moveList: Move[];
  focusedMoveIndex?: number;
  onMoveClick: (move: Move, _: number) => void;
}) => {
  let pairs = [];
  let currentPair = [];
  forEach(moveList, (move, i) => {
    if (move.color == "b" && isEmpty(currentPair)) {
      pairs.push([{}, { move, i }]);
      return;
    }
    currentPair.push({ move, i });
    if (move.color == "b") {
      pairs.push(currentPair);
      currentPair = [];
    }
  });
  if (!isEmpty(currentPair)) {
    if (currentPair.length === 1) {
      currentPair.push({});
    }
    pairs.push(currentPair);
  }
  const moveStyles = s(
    c.width(80),
    c.clickable,
    c.fontSize(18),
    c.weightSemiBold,
    c.fg(c.colors.textPrimary)
  );
  return (
    <View style={s(c.column)}>
      {pairs.map((pair, i) => {
        const [{ move: whiteMove, i: whiteI }, { move: blackMove, i: blackI }] =
          pair;
        const activeMoveStyles = s(c.weightBlack, c.fontSize(24));
        return (
          <View key={i} style={s(c.column)}>
            <View style={s(c.row, c.alignEnd, c.height(32))}>
              <Text
                style={s(
                  c.fg(c.colors.textPrimary),
                  c.fontSize(18),
                  c.weightSemiBold,
                  c.width(32)
                )}
              >
                {i + 1}
              </Text>
              <Space width={8} />
              <Pressable
                onPress={() => {
                  onMoveClick(whiteMove, whiteI);
                }}
              >
                <Text
                  style={s(
                    moveStyles,
                    focusedMoveIndex === whiteI && activeMoveStyles
                  )}
                >
                  {whiteMove?.san ?? "..."}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onMoveClick(blackMove, blackI);
                }}
              >
                <Text
                  style={s(
                    moveStyles,
                    focusedMoveIndex === blackI && activeMoveStyles
                  )}
                >
                  {blackMove?.san ?? "..."}
                </Text>
              </Pressable>
            </View>
            {i != pairs.length - 1 && <Space height={4} />}
          </View>
        );
      })}
    </View>
  );
};
