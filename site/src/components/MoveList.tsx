import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { s, c } from "@src/styles";
import { times } from "@src/utils";
import BishopBlackIcon from "@src/chessboard/pieces/BishopBlackIcon";
import BishopWhiteIcon from "@src/chessboard/pieces/BishopWhiteIcon";
import KingBlackIcon from "@src/chessboard/pieces/KingBlackIcon";
import KingWhiteIcon from "@src/chessboard/pieces/KingWhiteIcon";
import KnightBlackIcon from "@src/chessboard/pieces/KnightBlackIcon";
import KnightWhiteIcon from "@src/chessboard/pieces/KnightWhiteIcon";
import PawnBlackIcon from "@src/chessboard/pieces/PawnBlackIcon";
import PawnWhiteIcon from "@src/chessboard/pieces/PawnWhiteIcon";
import QueenBlackIcon from "@src/chessboard/pieces/QueenBlackIcon";
import QueenWhiteIcon from "@src/chessboard/pieces/QueenWhiteIcon";
import RookBlackIcon from "@src/chessboard/pieces/RookBlackIcon";
import RookWhiteIcon from "@src/chessboard/pieces/RookWhiteIcon";
import { Chess, PieceSymbol } from "@lubert/chess.ts";
import { forEach, isEmpty, cloneDeep, takeRight, first } from "lodash";
import useDesign from "@src/design";
import { Button, Text, useTheme } from "@ui-kitten/components";
import { useImmer } from "use-immer";
import { LichessPuzzle } from "@src/models";
import client from "@src/client";
import { Space } from "@src/Space";
import * as Linking from "expo-linking";
import { Move } from "chess.js";
import NumericInput from "react-native-numeric-input";

export const MoveList = ({
  moveList,
  onMoveClick,
}: {
  moveList: Move[];
  onMoveClick: (move: Move) => void;
}) => {
  let pairs = [];
  let currentPair = [];
  forEach(moveList, (move) => {
    if (move.color == "b" && isEmpty(currentPair)) {
      pairs.push([null, move]);
      return;
    }
    currentPair.push(move);
    if (move.color == "b") {
      pairs.push(currentPair);
      currentPair = [];
    }
  });
  if (!isEmpty(currentPair)) {
    pairs.push(currentPair);
  }
  const design = useDesign();
  const moveStyles = s(
    c.width(62),
    c.clickable,
    c.fontSize(16),
    c.weightSemiBold,
    c.fg(design.textPrimary)
  );
  return (
    <View style={s(c.column)}>
      {pairs.map((pair, i) => {
        const [whiteMove, blackMove] = pair;
        return (
          <View key={i} style={s(c.column)}>
            <View style={s(c.row)}>
              <Text
                style={s(c.fg(design.textPrimary), c.fontSize(16), c.width(24))}
              >
                {i + 1}
              </Text>
              <Space width={8} />
              <Pressable
                onPress={() => {
                  onMoveClick(whiteMove);
                }}
              >
                <Text style={moveStyles}>{whiteMove?.san ?? "..."}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onMoveClick(blackMove);
                }}
              >
                <Text style={moveStyles}>{blackMove?.san ?? "..."}</Text>
              </Pressable>
            </View>
            {i != pairs.length - 1 && <Space height={4} />}
          </View>
        );
      })}
    </View>
  );
};
