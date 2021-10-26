import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApplicationProvider,
  IconRegistry,
  Button,
  Layout,
  Text,
  useTheme,
} from "@ui-kitten/components";
// import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Platform, Pressable, useWindowDimensions, View } from "react-native";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { api } from "@src/utils/frisbee";
// import { ExchangeRates } from "@src/ExchangeRate";
import { c, s } from "@src/styles";
import useDesign from "@src/design";
import TopNav from "@src/TopNav";
import { Space } from "@src/Space";
import { ChessboardView } from "@src/chessboard/Chessboard";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useImmer } from "use-immer";
import { Chess, Move } from "@lubert/chess.ts";
import client from "@src/client";
import { cloneDeep, isEmpty, takeRight } from "lodash";
import { MoveList } from "./MoveList";
import { LichessPuzzle } from "@src/models";
import { ChessboardBiref } from "@src/types/ChessboardBiref";
// import { Feather } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";

const fakePuzzle: LichessPuzzle = {
  id: "01MQ3",
  moves: ["c8b8", "b7c7", "c4c7", "a5c7"],
  fen: "2r5/1Rb1k3/p3p2p/B5p1/2r1p3/6PP/3R1P2/6K1 b - - 0 37",
  popularity: 97,
  tags: ["advantage", "endgame", "short"],
  gameLink: "https://lichess.org/p97EKhqM/black#74",
  rating: 996,
  ratingDeviation: 76,
  numberPlays: 1056,
  allMoves: [
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
    "Kg2",
  ],
  maxPly: 72,
};
const fakeBlackPuzzle: LichessPuzzle = {
  id: "005HF",
  moves: ["c7g7", "g8g7", "h3g3", "g7h8"],
  fen: "3r1rk1/1pR3pp/p2bp3/1q2Np2/3P4/1P5Q/5PPP/4R1K1 w - - 2 27",
  popularity: 65,
  tags: ["crushing", "defensiveMove", "hangingPiece", "middlegame", "short"],
  gameLink: "https://lichess.org/IqVPsfjB#53",
  rating: 1375,
  ratingDeviation: 83,
  numberPlays: 37,
  allMoves: [
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
    "Qxe8",
  ],
  maxPly: 52,
};

interface ProgressMessage {
  message: string;
  type: ProgressMessageType;
}
enum ProgressMessageType {
  Error,
  Success,
}

const test = true;
const testProgress = false;
const debugButtons = true;

const fensTheSame = (x, y) => {
  if (x.split(" ")[0] == y.split(" ")[0]) {
    return true;
  }
};

const fetchNewPuzzle = async (maxPly: number): Promise<LichessPuzzle> => {
  if (test) {
    return cloneDeep(fakePuzzle);
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

export const VisualizationTraining = () => {
  const theme = useTheme();
  // const {
  //   data: repertoires,
  //   loading,
  //   error,
  // } = useQuery<GetCommunityRepertoires>(GET_COMMUNITY_REPERTOIRES);
  const design = useDesign();
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 1000;
  useEffect(() => {
    setTimeout(() => {
      document.title = "chessmadra";
    }, 100);
  });
  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.backgroundColor = "hsl(230, 40%, 4%)";
    }
  }, []);
  const [progressMessage, setProgressMessage] = useState(
    (testProgress
      ? { message: "Test message", type: ProgressMessageType.Error }
      : null) as ProgressMessage
  );
  const incrementDecrementStyles = s(
    c.size(40),
    c.bg(theme["color-basic-400"]),
    c.center
  );
  let [currentPosition, setCurrentPosition] = useState(new Chess());
  let [futurePosition, setFuturePosition] = useState(new Chess());
  let [ply, setPly] = useState(6);
  let [hiddenMoves, setHiddenMoves] = useState(null);
  let [solutionMoves, setSolutionMoves] = useImmer([] as Move[]);
  const [flipped, setFlipped] = useState(false);
  const [puzzle, setPuzzle] = useState(test ? fakeBlackPuzzle : null);
  const refreshPuzzle = () => {
    (async () => {
      let newPuzzle = await fetchNewPuzzle(ply);
      setPuzzle(newPuzzle);
      setShowFuturePosition(false);
      setProgressMessage(null);
    })();
  };
  const incrementDecrementTextStyles = s(
    c.fontSize(24),
    c.weightRegular,
    c.fg(theme["color-basic-900"])
  );
  useEffect(() => {
    if (puzzle === null) {
      refreshPuzzle();
    }
  }, [puzzle]);
  const [isPlaying, setIsPlaying] = useState(false);
  const animateMoves = useCallback(() => {
    setIsPlaying(true);
    let moves = cloneDeep(hiddenMoves);
    let animateNextMove = () => {
      let move = moves.shift();
      if (move) {
        biref.highlightMove(move, () => {
          animateNextMove();
        });
      } else {
        setIsPlaying(false);
      }
    };
    animateNextMove();
  }, [hiddenMoves]);

  const attemptSolution = useCallback(
    (move: Move) => {
      if (move.san == solutionMoves[0].san) {
        setShowFuturePosition(true);
        biref.flashRing();
        futurePosition.move(solutionMoves[0]);
        futurePosition.move(solutionMoves[1]);
        setSolutionMoves((s) => {
          s.shift();
          s.shift();
          if (!isEmpty(s)) {
            setProgressMessage({
              message: "Keep going...",
              type: ProgressMessageType.Success,
            });
          } else {
            setProgressMessage({
              message:
                "You've completed this puzzle! Hit next puzzle to continue training",
              type: ProgressMessageType.Success,
            });
          }
          return s;
        });
      } else {
        biref.flashRing(false);
        setProgressMessage({
          message: `${move.san} was not the right move, try again.`,
          type: ProgressMessageType.Error,
        });
      }
    },
    [solutionMoves]
  );
  const biref: ChessboardBiref = useMemo(() => {
    return {};
  }, []);
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
          hiddenMoves = takeRight(
            currentPosition.history({ verbose: true }),
            ply
          );
          let boardForPuzzleMoves = futurePosition.clone();
          boardForPuzzleMoves.undo();
          for (let solutionMove of puzzle.moves) {
            boardForPuzzleMoves.move(solutionMove, { sloppy: true });
          }
          // @ts-ignore
          setSolutionMoves(
            takeRight(
              boardForPuzzleMoves.history({ verbose: true }),
              puzzle.moves.length - 1
            )
          );
          // currentPosition.undo()

          setHiddenMoves(hiddenMoves);
          for (let i = 0; i < ply; i++) {
            currentPosition.undo();
          }
          setCurrentPosition(currentPosition);
          setFuturePosition(futurePosition);
          setShowFuturePosition(false);
          setFlipped(futurePosition.turn() === "b");
          biref.setAvailableMoves([]);
          break;
        }
      }
    }
  }, [puzzle, ply]);
  const [showFuturePosition, setShowFuturePosition] = useState(false);
  const nextPreviousStyles = s(
    c.width(70),
    c.center,
    c.bg(theme["color-basic-100"]),
    c.border("none")
  );
  const nextPreviousIconProps = {
    style: s(c.fg(theme["color-basic-900"])),
    size: 24,
  };
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "none",
      }}
    >
      <View
        style={s(
          c.fullWidth,
          !isMobile && c.center,
          !isMobile && c.minWidth("100vw"),
          !isMobile && c.minHeight("100vh"),
          isMobile && c.px(10),
          isMobile && c.pt(10)
        )}
      >
        <View
          style={s(isMobile ? c.column : c.row, isMobile && s(c.alignCenter))}
        >
          <View style={s(c.width(500), c.maxWidth("100%"), c.selfCenter)}>
            <ChessboardView
              {...{
                attemptSolution,
                biref,
                flipped,
                currentPosition,
                futurePosition,
                showFuturePosition,
              }}
            />
            <Space height={12} width={12} isMobile={isMobile} />
            <View style={s(c.column, c.maxWidth(500))}>
              {progressMessage && (
                <>
                  <View style={s(c.br(4), c.fullWidth)}>
                    <Text
                      style={s(
                        c.fg(
                          progressMessage.type === ProgressMessageType.Error
                            ? design.failureLight
                            : design.successColor
                        ),
                        c.weightBold
                      )}
                    >
                      {progressMessage.message}
                    </Text>
                  </View>
                  <Space height={12} />
                </>
              )}
              {!showFuturePosition && (
                <>
                  <View style={s(c.row, c.alignStretch, c.fullWidth)}>
                    <Button
                      style={s(nextPreviousStyles)}
                      onPress={() => {
                        focusLastMove();
                      }}
                    >
                      <Text>
                        <Icon name="chevron-left" {...nextPreviousIconProps} />
                      </Text>
                    </Button>
                    <Button
                      style={s(
                        c.grow,
                        c.mx(20),
                        c.px(20),
                        c.bg(theme["color-primary-500"])
                      )}
                      onPress={animateMoves}
                    >
                      <Text>
                        <Icon name="play-arrow" size={32} />
                      </Text>
                    </Button>
                    <Button
                      style={s(nextPreviousStyles)}
                      onPress={() => {
                        focusNextMove();
                      }}
                    >
                      <Text>
                        <Icon name="chevron-right" {...nextPreviousIconProps} />
                      </Text>
                    </Button>
                  </View>
                  <Space height={12} />
                </>
              )}
              <View style={s()}>
                <Text style={s(c.weightSemiBold)}>
                  {futurePosition.turn() == "b" ? "Black" : "White"} to move.
                  Visualize the following, then make the best move.
                </Text>
                <Space height={12} />
                <Text>
                  <MoveList
                    moveList={hiddenMoves}
                    onMoveClick={(move) => {
                      biref.highlightMove(move);
                    }}
                  />
                </Text>
              </View>
              <Space height={24} />
              <Button
                onPress={() => {
                  refreshPuzzle();
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
              <Space height={12} />
              <View style={s(c.row, c.alignCenter, c.selfCenter)}>
                <Pressable
                  onPress={() => {
                    setPly(Math.max(1, ply - 1));
                  }}
                >
                  <View style={s(incrementDecrementStyles)}>
                    <Text style={incrementDecrementTextStyles}>-</Text>
                  </View>
                </Pressable>
                <Space width={12} />
                <View style={s(c.column, c.alignCenter, c.width(40))}>
                  <Text
                    style={s(
                      c.fg("white"),
                      c.opacity(80),
                      c.fontSize(12),
                      c.caps,
                      c.weightBold
                    )}
                  >
                    Ply
                  </Text>
                  <Text
                    style={s(
                      c.fg(design.textPrimary),
                      c.fontSize(24),
                      c.weightBold
                    )}
                  >
                    {ply}
                  </Text>
                </View>
                <Space width={12} />
                <Pressable
                  onPress={() => {
                    setPly(ply + 1);
                  }}
                >
                  <View style={s(incrementDecrementStyles)}>
                    <Text style={incrementDecrementTextStyles}>+</Text>
                  </View>
                </Pressable>
              </View>
              {debugButtons && (
                <>
                  <Space height={12} />
                  <Button
                    status="basic"
                    onPress={() => {
                      biref.flashRing();
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
                      setPly(ply + 100);
                    }}
                  >
                    Increment ply
                  </Button>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};
