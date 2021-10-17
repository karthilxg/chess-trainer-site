import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
import _ from "lodash";
import useDesign from "@src/design";
import { Button, Text, useTheme } from "@ui-kitten/components";
import { useImmer } from "use-immer";
import { LichessPuzzle } from "@src/models";
import client from "@src/client";
import { Space } from "@src/Space";
import * as Linking from "expo-linking";
import { Move } from "chess.js";

interface ProgressMessage {
  message: string,
  type: ProgressMessageType
}
enum ProgressMessageType {
  Error,
  Success
}

const lightTileColor = c.hsl(180, 15, 70);
const darkTileColor = c.hsl(180, 15, 40);
const MoveList = ({ moveList }: { moveList: Move[] }) => {
  let pairs = [];
  let currentPair = [];
  _.forEach(moveList, (move) => {
    if (move.color == "b" && _.isEmpty(currentPair)) {
      pairs.push([null, move]);
      return;
    }
    currentPair.push(move);
    if (move.color == "b") {
      pairs.push(currentPair);
      currentPair = [];
    }
  });
  if (!_.isEmpty(currentPair)) {
    pairs.push(currentPair);
  }
  const design = useDesign();
  const moveStyles = s(
    c.width(62),
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
              <Text style={moveStyles}>{whiteMove?.san ?? "..."}</Text>
              <Text style={moveStyles}>{blackMove?.san ?? "..."}</Text>
            </View>
            {i != (pairs.length - 1) && (
              <Space height={4} />
            )}
          </View>

        );
      })}
    </View>
  );
};

const fakePuzzle: LichessPuzzle =
{
  "id": "01MQ3",
  "moves": [
    "c8b8",
    "b7c7",
    "c4c7",
    "a5c7"
  ],
  "fen": "2r5/1Rb1k3/p3p2p/B5p1/2r1p3/6PP/3R1P2/6K1 b - - 0 37",
  "popularity": 97,
  "tags": [
    "advantage",
    "endgame",
    "short"
  ],
  "gameLink": "https://lichess.org/p97EKhqM/black#74",
  "rating": 996,
  "ratingDeviation": 76,
  "numberPlays": 1056,
  "allMoves": [
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bc4",
    "h6",
    "d4",
    "d6",
    "dxe5",
    "Nxe5",
    "Nxe5",
    "dxe5",
    "Qxd8+",
    "Kxd8",
    "O-O",
    "Nf6",
    "Nc3",
    "Be6",
    "Bxe6",
    "fxe6",
    "a3",
    "a6",
    "Be3",
    "b5",
    "Rad1+",
    "Ke8",
    "h3",
    "b4",
    "Ne2",
    "bxa3",
    "bxa3",
    "Bxa3",
    "Rd3",
    "Be7",
    "Rfd1",
    "Nxe4",
    "Nc3",
    "Nxc3",
    "Rxc3",
    "Bd6",
    "Bc5",
    "Kd7",
    "Ba3",
    "Rhc8",
    "Re3",
    "Ke7",
    "Ra1",
    "Kf7",
    "c4",
    "c5",
    "Rd1",
    "Rd8",
    "Red3",
    "Ke7",
    "Rg3",
    "g5",
    "Re3",
    "Rab8",
    "Rd2",
    "Rb7",
    "Red3",
    "Rb6",
    "Bxc5",
    "Rc6",
    "Bb4",
    "e4",
    "Rb3",
    "Rxc4",
    "Ba5",
    "Rdc8",
    "Rb7+",
    "Bc7",
    "g3",
    "Rb8",
    "Rxc7+",
    "Rxc7",
    "Bxc7",
    "Rb1+",
    "Kg2"
  ],
  "maxPly": 72
};
const fakeBlackPuzzle: LichessPuzzle = {
  "id": "005HF",
  "moves": [
    "c7g7",
    "g8g7",
    "h3g3",
    "g7h8"
  ],
  "fen": "3r1rk1/1pR3pp/p2bp3/1q2Np2/3P4/1P5Q/5PPP/4R1K1 w - - 2 27",
  "popularity": 65,
  "tags": [
    "crushing",
    "defensiveMove",
    "hangingPiece",
    "middlegame",
    "short"
  ],
  "gameLink": "https://lichess.org/IqVPsfjB#53",
  "rating": 1375,
  "ratingDeviation": 83,
  "numberPlays": 37,
  "allMoves": [
    "e4",
    "c6",
    "d4",
    "d5",
    "exd5",
    "cxd5",
    "Bd3",
    "e6",
    "Nf3",
    "Nc6",
    "c3",
    "Bd6",
    "O-O",
    "Nge7",
    "Re1",
    "Qc7",
    "Bg5",
    "Ng6",
    "Nbd2",
    "Bd7",
    "a4",
    "a6",
    "c4",
    "Nf4",
    "Bc2",
    "dxc4",
    "Nxc4",
    "Be7",
    "Bxf4",
    "Qxf4",
    "Re4",
    "Qc7",
    "Qd3",
    "f5",
    "Re2",
    "O-O",
    "Rae1",
    "Rad8",
    "Nfe5",
    "Nb4",
    "Qh3",
    "Nxc2",
    "Rxc2",
    "Bxa4",
    "b3",
    "Bb5",
    "Na3",
    "Qb6",
    "Nxb5",
    "Qxb5",
    "Rc7",
    "Bd6",
    "Rxg7+",
    "Kxg7",
    "Qg3+",
    "Kh8",
    "Ng6+",
    "hxg6",
    "Qxg6",
    "Qd7",
    "Qh6+",
    "Qh7",
    "Qxe6",
    "Qxh2+",
    "Kf1",
    "Qh1+",
    "Ke2",
    "Qxe1+",
    "Kxe1",
    "Rde8",
    "Qxe8"
  ],
  "maxPly": 52
};

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

const fensTheSame = (x, y) => {
  if (x.split(" ")[0] == y.split(" ")[0]) {
    return true;
  }
};

const test = false;
const debugButtons = true;
const fetchNewPuzzle = async (maxPly: number) => {
  if (test) {
    return _.cloneDeep(fakePuzzle);
  }
  try {
    let response = await client.post("/api/v1/tactic", {
      max_ply: maxPly,
    });
    return response.data as LichessPuzzle;
  } catch (error) {
    console.log(error);
  }
};

export const ChessboardView = ({ }) => {
  const tileStyles = s(c.bg("green"), c.grow);
  let [currentPosition, setCurrentPosition] = useState(new Chess());
  let [futurePosition, setFuturePosition] = useState(new Chess());
  let [availableMoves, setAvailableMoves] = useState([] as Move[]);
  let [ply, setPly] = useState(4);
  let [hiddenMoves, setHiddenMoves] = useState(null);
  let [solutionMoves, setSolutionMoves] = useImmer([] as Move[]);
  console.log(solutionMoves)
  const design = useDesign();
  const theme = useTheme();
  const ringIndicatorAnim = useRef(new Animated.Value(0)).current;
  const animDuration = 200;
  const [ringColor, setRingColor] = useState(design.successColor)
  const flashRing = (success = true) => {
    setRingColor(success ? design.successColor : design.failureColor)
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
  const [puzzle, setPuzzle] = useState(test ? fakePuzzle : null);
  const refreshPuzzle = () => {
    (async () => {
      let newPuzzle = await fetchNewPuzzle(ply);
      setPuzzle(newPuzzle);
      setShowFuturePosition(false)
      setProgressMessage(null)
    })();
  }
  useEffect(() => {
    if (puzzle === null) {
      refreshPuzzle()
    }
  }, [puzzle]);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (puzzle) {
      let currentPosition = new Chess();
      let futurePosition = new Chess();
      for (let move of puzzle.allMoves) {
        currentPosition.move(move);
        futurePosition.move(move);
        if (fensTheSame(currentPosition.fen(), puzzle.fen)) {
          futurePosition.move(puzzle.moves[0], { sloppy: true });
          currentPosition.move(puzzle.moves[0], { sloppy: true });
          hiddenMoves = _.takeRight(
            currentPosition.history({ verbose: true }),
            ply
          );
          let boardForPuzzleMoves = futurePosition.clone();
          boardForPuzzleMoves.undo()
          for (let solutionMove of puzzle.moves) {
            boardForPuzzleMoves.move(solutionMove, { sloppy: true });
          }
          console.log(boardForPuzzleMoves.ascii())
          // @ts-ignore
          setSolutionMoves(_.takeRight(
            boardForPuzzleMoves.history({ verbose: true }),
            puzzle.moves.length - 1
          ));
          // currentPosition.undo()

          setHiddenMoves(hiddenMoves);
          for (let i = 0; i < ply; i++) {
            currentPosition.undo();
          }
          setCurrentPosition(currentPosition);
          setFuturePosition(futurePosition);
          setShowFuturePosition(false)
          setFlipped(futurePosition.turn() === "b");
          setAvailableMoves([]);
          break;
        }
      }
    }
  }, [puzzle, ply]);
  const [showFuturePosition, setShowFuturePosition] = useState(false);
  const [progressMessage, setProgressMessage] = useState((test ? { message: "Test message", type: ProgressMessageType.Error } : null) as ProgressMessage);
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 1000;
  return (
    <View
      style={s(
        c.fullWidth,
        !isMobile && c.center,
        !isMobile && c.minWidth("100vw"),
        !isMobile && c.minHeight("100vh"),
        isMobile && c.px(18),
        isMobile && c.pt(18)
      )}
    >
      <View style={s(isMobile ? c.column : c.row)}>
        <View style={s(c.width(500), c.maxWidth("100%"))}>
          <View style={s(c.pb("100%"), c.height(0), c.width("100%"))}>
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
                backgroundColor: design.backgroundColorSecondary,
              }}
            >
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
                      style={s(
                        c.fullWidth,
                        c.bg("red"),
                        c.row,
                        c.grow,
                        c.flexible
                      )}
                    >
                      {times(8)((j) => {
                        let color =
                          (i + j) % 2 == 0 ? lightTileColor : darkTileColor;
                        let square = `${columns[j]}${rows[7 - i]}`;
                        if (flipped) {
                          square = `${columns[7 - j]}${rows[i]}`;
                        }
                        let position = showFuturePosition
                          ? futurePosition
                          : currentPosition;
                        let piece = position.get(square);
                        let pieceView = null;
                        if (piece) {
                          pieceView = (
                            <PieceView
                              piece={piece["type"]}
                              color={piece["color"]}
                            />
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
                              c.flexible,
                              c.overflowHidden
                            )}
                            onPress={() => {
                              if (availableMove) {
                                setAvailableMoves([]);
                                if (availableMove.san == solutionMoves[0].san) {
                                  setShowFuturePosition(true);
                                  flashRing();
                                  futurePosition.move(solutionMoves[0]);
                                  futurePosition.move(solutionMoves[1]);
                                  setSolutionMoves((s) => {
                                    s.shift();
                                    s.shift();
                                    if (!_.isEmpty(s)) {
                                      setProgressMessage(
                                        {
                                          message: "Keep going...",
                                          type: ProgressMessageType.Success
                                        }
                                      );
                                    } else {
                                      setProgressMessage(
                                        {
                                          message: "You've completed this puzzle! Hit next puzzle to continue training",
                                          type: ProgressMessageType.Success
                                        }
                                      );
                                    }
                                    return s;
                                  });
                                } else {
                                  flashRing(false)
                                  setProgressMessage(
                                    {
                                      message:
                                        `${availableMove.san} was not the right move, try again.`,
                                      type: ProgressMessageType.Error
                                    }
                                  );
                                }
                                return;
                              }
                              let moves = futurePosition.moves({
                                square,
                                verbose: true,
                              });
                              if (
                                !_.isEmpty(availableMoves) &&
                                _.first(availableMoves).from == square
                              ) {
                                setAvailableMoves([]);
                              } else {
                                // @ts-ignore
                                setAvailableMoves(moves);
                              }
                            }}
                          >
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
                            <View>{pieceView}</View>
                          </Pressable>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
        <Space height={12} width={12} isMobile={isMobile} />
        <View style={s(c.column)}>
          {progressMessage && (
            <>
              <View style={s(c.br(4), c.fullWidth)}>
                <Text style={s(c.fg(progressMessage.type === ProgressMessageType.Error ? design.failureLight : design.successColor), c.weightBold)} >
                  {progressMessage.message}
                </Text>
              </View>
              <Space height={12} />
            </>
          )}
          <View style={s()}>
            <Text style={s(c.weightSemiBold)}>
              Visualize the following, then make the best move.
              </Text>
            <Space height={12} />
            <Text>
              <MoveList moveList={hiddenMoves} />
            </Text>
          </View>
          <Space height={24} />
          <Button
            onPress={() => {
              refreshPuzzle()
            }}
          >
            Next Puzzle
            </Button>
          <Space height={12} />
          <Button
            status="basic"
            onPress={() => {
              (async () => {
                if (Platform.OS == "web") {
                  window.open(
                    `https://lichess.org/training/${puzzle.id}`,
                    "_blank"
                  );
                }
              })();
            }}
          >
            View puzzle on lichess
            </Button>
          {debugButtons && (
            <>
              <Space height={12} />
              <Button
                status="basic"
                onPress={() => {
                  flashRing();
                }}
              >
                Flash ring
                </Button>
              <Space height={12} />
              <Button
                status="basic"
                onPress={() => {
                  currentPosition.move(hiddenMoves[0]);
                  setHiddenMoves((s) => {
                    s.shift();
                    return s;
                  });
                }}
              >
                Advance one move
                </Button>
              <Space height={12} />
              <Button
                status="basic"
                onPress={() => {
                  setShowFuturePosition(true);
                }}
              >
                Show future position
                </Button>
              <Space height={12} />
              <Button
                status="basic"
                onPress={() => {
                  setPly(ply + 100)
                }}
              >
                Increment ply
                </Button>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
