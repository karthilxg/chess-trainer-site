import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
import { Chess, PieceSymbol, SQUARES } from "@lubert/chess.ts";
import {
  forEach,
  isEmpty,
  cloneDeep,
  takeRight,
  first,
  map,
  mapValues,
  isEqual,
  indexOf,
} from "lodash";
import { useImmer } from "use-immer";
import { LichessPuzzle } from "@src/models";
import client from "@src/client";
import { Space } from "@src/Space";
import * as Linking from "expo-linking";
import { Move, Square } from "@lubert/chess.ts/dist/types";
import { ChessboardBiref } from "@src/types/ChessboardBiref";
import { useEffectWithPrevious } from "@src/utils/useEffectWithPrevious";
import { useComponentLayout } from "@src/utils/useComponentLayout";

const lightTileColor = c.hsl(180, 15, 70);
const darkTileColor = c.hsl(180, 15, 40);

enum ChessPiece {
  Pawn = "p",
  Rook = "r",
  Knight = "n",
  Bishop = "b",
  Queen = "q",
  King = "k",
}

type ChessColor = "w" | "b";

const getIconForPiece = (piece: PieceSymbol, color: ChessColor) => {
  switch (color) {
    case "b":
      switch (piece) {
        case ChessPiece.Rook:
          return <RookBlackIcon />;
        case ChessPiece.Pawn:
          return <PawnBlackIcon />;
        case ChessPiece.Knight:
          return <KnightBlackIcon />;
        case ChessPiece.Queen:
          return <QueenBlackIcon />;
        case ChessPiece.Bishop:
          return <BishopBlackIcon />;
        case ChessPiece.King:
          return <KingBlackIcon />;
      }
    case "w":
      switch (piece) {
        case ChessPiece.Rook:
          return <RookWhiteIcon />;
        case ChessPiece.Pawn:
          return <PawnWhiteIcon />;
        case ChessPiece.Knight:
          return <KnightWhiteIcon />;
        case ChessPiece.Queen:
          return <QueenWhiteIcon />;
        case ChessPiece.Bishop:
          return <BishopWhiteIcon />;
        case ChessPiece.King:
          return <KingWhiteIcon />;
      }
  }
};

export const PieceView = ({
  piece,
  color,
}: {
  piece: PieceSymbol;
  color: ChessColor;
}) => {
  return <View>{getIconForPiece(piece, color)}</View>;
};

const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rows = [1, 2, 3, 4, 5, 6, 7, 8];

export const ChessboardView = ({
  currentPosition,
  futurePosition,
  flipped,
  attemptSolution,
  showFuturePosition,
  biref,
}: {
  currentPosition;
  futurePosition;
  flipped;
  attemptSolution;
  showFuturePosition;
  biref: ChessboardBiref;
}) => {
  // @ts-ignore
  let [{ height: chessboardSize }, onChessboardLayout] = useComponentLayout();
  chessboardSize = chessboardSize ?? 500; // just for first render
  const tileStyles = s(c.bg("green"), c.grow);
  let [availableMoves, setAvailableMoves] = useState([] as Move[]);
  biref.setAvailableMoves = setAvailableMoves;

  const getSquareOffset = useCallback(
    (square: string) => {
      const [file, rank] = square;
      let x = indexOf(columns, file);
      let y = 7 - indexOf(rows, parseInt(rank));
      if (flipped) {
        x = 7 - x;
        y = 7 - y;
      }
      return { x: (x / 8) * chessboardSize, y: (y / 8) * chessboardSize };
    },
    [chessboardSize, flipped]
  );
  const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [moveIndicatorColor, setMoveIndicatorColor] = useState(null);
  const moveIndicatorOpacityAnim = useRef(new Animated.Value(0)).current;
  biref.highlightMove = useCallback(
    (move: Move, backwards = false, callback: () => void) => {
      let moveDuration = 200;
      let fadeDuration = 200;
      setMoveIndicatorColor(
        move.color == "b" ? c.hsl(180, 15, 0, 60) : c.hsl(180, 15, 100, 60)
      );
      let [start, end] = backwards
        ? [move.to, move.from]
        : [move.from, move.to];
      moveAnim.setValue(getSquareOffset(start));
      Animated.sequence([
        Animated.timing(moveIndicatorOpacityAnim, {
          toValue: 1.0,
          duration: fadeDuration,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(moveAnim, {
          toValue: getSquareOffset(end),
          duration: moveDuration,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(moveIndicatorOpacityAnim, {
          toValue: 0,
          duration: fadeDuration,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(callback);
    },
    [chessboardSize, flipped]
  );
  // TODO: maybe remove
  const squareHighlightAnims = useMemo(() => {
    return mapValues(SQUARES, (number, square) => {
      return new Animated.Value(0.0);
    });
  }, []);

  const ringIndicatorAnim = useRef(new Animated.Value(0)).current;
  const animDuration = 200;
  const [highlightedSquares, setHighlightedSquares] = useImmer([] as Square[]);
  useEffectWithPrevious(
    (previousHighlightedSquares = []) => {
      let highlightFadeDuration = 100;
      previousHighlightedSquares.map((sq) => {
        Animated.timing(squareHighlightAnims[sq], {
          toValue: 0,
          duration: animDuration,
          useNativeDriver: false,
        }).start();
      });
      highlightedSquares.map((sq) => {
        Animated.timing(squareHighlightAnims[sq], {
          toValue: 0.3,
          duration: animDuration,
          useNativeDriver: false,
        }).start();
      });
    },
    [highlightedSquares]
  );
  const [ringColor, setRingColor] = useState(c.colors.successColor);
  const flashRing = (success = true) => {
    setRingColor(success ? c.colors.successColor : c.colors.failureColor);
    Animated.sequence([
      Animated.timing(ringIndicatorAnim, {
        toValue: 1,
        duration: animDuration,
        useNativeDriver: false,
      }),

      Animated.timing(ringIndicatorAnim, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: false,
      }),
    ]).start();
  };
  biref.flashRing = flashRing;
  const testRef = useRef(null);
  useEffect(() => {
    if (testRef.current) {
      testRef.current.setAttribute("id", "test");
    }
  });

  const { width: windowWidth } = useWindowDimensions();
  return (
    <View
      style={s(c.pb("100%"), c.height(0), c.width("100%"))}
      // @ts-ignore
      onLayout={onChessboardLayout}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          borderRadius: 2,
          overflow: "hidden",
          shadowColor: "black",
          shadowOpacity: 0.4,
          shadowRadius: 10,
          backgroundColor: c.colors.backgroundColorSecondary,
        }}
      >
        <Animated.View
          ref={testRef}
          pointerEvents="none"
          style={s(
            c.size("calc(1/8 * 100%)"),
            c.zIndex(5),
            c.absolute,
            c.center,
            c.opacity(moveIndicatorOpacityAnim),
            moveAnim.getLayout()
          )}
        >
          <View
            style={s(c.size("50%"), c.round, c.bg(moveIndicatorColor))}
          ></View>
        </Animated.View>
        <Animated.View // Special animatable View
          style={s(
            c.absolute,
            c.fullWidth,
            c.fullHeight,
            c.zIndex(3),
            // c.bg("black"),
            c.border(`6px solid ${ringColor}`),
            // @ts-ignore
            c.opacity(ringIndicatorAnim)
          )}
          pointerEvents="none"
        ></Animated.View>
        <View style={s(c.column, c.fullWidth, c.fullHeight)}>
          {times(8)((i) => {
            return (
              <View
                key={i}
                style={s(c.fullWidth, c.bg("red"), c.row, c.grow, c.flexible)}
              >
                {times(8)((j) => {
                  let color = (i + j) % 2 == 0 ? lightTileColor : darkTileColor;
                  let square = `${columns[j]}${rows[7 - i]}` as Square;
                  if (flipped) {
                    square = `${columns[7 - j]}${rows[i]}` as Square;
                  }
                  let position = showFuturePosition
                    ? futurePosition
                    : currentPosition;
                  let piece = position.get(square);
                  let pieceView = null;
                  if (piece) {
                    pieceView = (
                      <PieceView piece={piece["type"]} color={piece["color"]} />
                    );
                  }
                  let availableMove = availableMoves.find(
                    (m) => m.to == square
                  );
                  return (
                    <Pressable
                      key={j}
                      style={s(
                        tileStyles,
                        c.bg(color),
                        c.center,
                        c.clickable,
                        c.flexible,
                        c.overflowHidden
                      )}
                      onPress={() => {
                        if (availableMove) {
                          setAvailableMoves([]);
                          attemptSolution(availableMove);
                          return;
                        }
                        let moves = futurePosition.moves({
                          square,
                          verbose: true,
                        });
                        if (
                          !isEmpty(availableMoves) &&
                          first(availableMoves).from == square
                        ) {
                          setAvailableMoves([]);
                        } else {
                          // @ts-ignore
                          setAvailableMoves(moves);
                        }
                      }}
                    >
                      <Animated.View
                        style={s(
                          {
                            opacity: squareHighlightAnims[square],
                          },
                          c.bg("hsl(80, 50%, 50%)"),
                          c.absolute,
                          c.size("100%"),
                          c.zIndex(4)
                        )}
                      ></Animated.View>
                      {availableMove &&
                        (availableMove.captured ? (
                          <View
                            style={s(
                              c.size("30%"),
                              c.opacity(40),
                              c.round,
                              c.bg("black"),
                              c.absolute,
                              c.zIndex(4)
                            )}
                          />
                        ) : (
                          <View
                            style={s(
                              c.size("30%"),
                              c.opacity(40),
                              c.round,
                              c.bg("black"),
                              c.absolute,
                              c.zIndex(4)
                            )}
                          />
                        ))}
                      <View style={s(c.fullWidth)}>{pieceView}</View>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
