import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Text,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  Modal
} from 'react-native'
// import { ExchangeRates } from "app/ExchangeRate";
import { c, s } from 'app/styles'
import { Spacer } from 'app/Space'
import {
  ChessboardView,
  getAnimationDurations,
  PlaybackSpeed
} from 'app/components/chessboard/Chessboard'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import { useImmer } from 'use-immer'
import { Chess, Move } from '@lubert/chess.ts'
import client from 'app/client'
import { cloneDeep, isEmpty, isNil, takeRight } from 'lodash'
import { MoveList } from './MoveList'
import { LichessPuzzle } from 'app/models'
import { ChessboardBiref } from 'app/types/ChessboardBiref'
// import { Feather } from "@expo/vector-icons";
// import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button } from './Button'
import useState from 'react-usestateref'
import { useStorageState } from 'react-storage-hooks'
import { TrainerLayout } from 'app/components/TrainerLayout'
import { useIsMobile } from 'app/utils/isMobile'
import { fakePuzzle, fakeBlackPuzzle } from 'app/mocks/puzzles'

const isCheckmate = (move: Move, position: Chess) => {
  position.move(move)
  let isCheckMate = position.inCheckmate()
  position.undo()
  return isCheckMate
}

interface ProgressMessage {
  message: string
  type: ProgressMessageType
}
enum ProgressMessageType {
  Error,
  Success
}

const test = false
const testProgress = false
const debugButtons = false

const fensTheSame = (x, y) => {
  if (x.split(' ')[0] == y.split(' ')[0]) {
    return true
  }
}

const fetchNewPuzzle = async (maxPly: number): Promise<LichessPuzzle> => {
  if (test) {
    return cloneDeep(fakePuzzle)
  }
  try {
    let response = await client.post('/api/v1/tactic', {
      max_ply: maxPly
    })
    return response.data as LichessPuzzle
  } catch (error) {
    console.log(error)
  }
}

export const VisualizationTraining = () => {
  const isMobile = useIsMobile()
  useEffect(() => {
    setTimeout(() => {
      document.title = 'chessmadra'
    }, 100)
  })
  const [progressMessage, setProgressMessage] = useState(
    (testProgress
      ? { message: 'Test message', type: ProgressMessageType.Error }
      : null) as ProgressMessage
  )
  const incrementDecrementStyles = s(c.buttons.basicInverse, c.size(40))
  let [currentPosition, setCurrentPosition] = useState(new Chess())
  let [futurePosition, setFuturePosition] = useState(new Chess())
  let [ply, setPly] = useStorageState(localStorage, 'visualization-ply', 2)
  let [hiddenMoves, setHiddenMoves] = useState(null)
  let [solutionMoves, setSolutionMoves] = useImmer([] as Move[])
  const [flipped, setFlipped] = useState(false)
  const [puzzle, setPuzzle] = useState(test ? fakeBlackPuzzle : null)
  const [nextPuzzle, setNextPuzzle] = useState(null)
  const refreshPuzzle = () => {
    if (nextPuzzle) {
      setNextPuzzle(null)
      setPuzzle(nextPuzzle)
      return
    }
    ;(async () => {
      let newPuzzle = await fetchNewPuzzle(ply)
      setPuzzle(newPuzzle)
      setShowFuturePosition(false)
      setProgressMessage(null)
    })()
  }
  const incrementDecrementTextStyles = s(c.fontSize(24), c.weightRegular)
  useEffect(() => {
    if (puzzle === null) {
      refreshPuzzle()
    }
    if (puzzle && nextPuzzle == null) {
      ;(async () => {
        setNextPuzzle(await fetchNewPuzzle(ply))
      })()
    }
  }, [puzzle])
  // TODO: helper to make state and ref
  const [isPlaying, setIsPlaying, isPlayingRef] = useState(false)
  const [focusedMoveIndex, setFocusedMoveIndex] = useState(null)
  const focusedMove =
    !isNil(focusedMoveIndex) && hiddenMoves && hiddenMoves[focusedMoveIndex]
  const focusOnMove = (i, cb, backwards = false) => {
    biref.highlightMove(hiddenMoves[i], backwards, () => {
      if (cb) {
        cb()
      }
    })
    setFocusedMoveIndex(i)
  }
  let canFocusLastMove = !isNil(focusedMoveIndex)
  const focusLastMove = () => {
    if (canFocusLastMove) {
      biref.highlightMove(hiddenMoves[focusedMoveIndex], true, () => {})
      let i = focusedMoveIndex - 1
      if (i == -1) {
        setFocusedMoveIndex(null)
      } else {
        setFocusedMoveIndex(i)
      }
    }
  }
  let canFocusNextMove =
    hiddenMoves && focusedMoveIndex != hiddenMoves.length - 1
  const [settingsOpen, setSettingsOpen] = useState(false)
  const focusNextMove = () => {
    if (canFocusNextMove) {
      let i = isNil(focusedMoveIndex) ? 0 : focusedMoveIndex + 1
      focusOnMove(i, null, false)
    }
  }
  const [playbackSpeed, setPlaybackSpeed] = useStorageState(
    localStorage,
    'playback-speed',
    PlaybackSpeed.Normal
  )
  const animateMoves = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
    let moves = cloneDeep(hiddenMoves)
    let i = 0
    let animateNextMove = () => {
      let move = moves.shift()
      if (move && isPlayingRef.current) {
        focusOnMove(i, () => {
          // let delay = getAnimationDurations(playbackSpeed)[2]
          // window.setTimeout(() => {
          animateNextMove()
          // }, delay)
        })
        i++
      } else {
        setIsPlaying(false)
      }
    }
    animateNextMove()
  }, [hiddenMoves, isPlaying, playbackSpeed])

  const attemptSolution = useCallback(
    (move: Move) => {
      if (
        move.san == solutionMoves[0].san ||
        isCheckmate(move, futurePosition)
      ) {
        setShowFuturePosition(true)
        biref.flashRing()
        futurePosition.move(move)
        if (solutionMoves[1]) {
          futurePosition.move(solutionMoves[1])
        }
        setSolutionMoves((s) => {
          s.shift()
          s.shift()
          if (!isEmpty(s)) {
            setProgressMessage({
              message: 'Keep going...',
              type: ProgressMessageType.Success
            })
          } else {
            setProgressMessage({
              message:
                "You've completed this puzzle! Hit new puzzle to continue training",
              type: ProgressMessageType.Success
            })
          }
          return s
        })
      } else {
        biref.flashRing(false)
        setProgressMessage({
          message: `${move.san} was not the right move, try again.`,
          type: ProgressMessageType.Error
        })
      }
    },
    [solutionMoves]
  )
  const biref: ChessboardBiref = useMemo(() => {
    return { attemptSolution }
  }, [attemptSolution])
  useEffect(() => {
    if (puzzle) {
      setFocusedMoveIndex(null)
      let currentPosition = new Chess()
      let futurePosition = new Chess()
      for (let move of puzzle.allMoves) {
        currentPosition.move(move)
        futurePosition.move(move)
        if (fensTheSame(currentPosition.fen(), puzzle.fen)) {
          futurePosition.move(puzzle.moves[0], { sloppy: true })
          currentPosition.move(puzzle.moves[0], { sloppy: true })
          hiddenMoves = takeRight(
            currentPosition.history({ verbose: true }),
            ply
          )
          let boardForPuzzleMoves = futurePosition.clone()
          boardForPuzzleMoves.undo()
          for (let solutionMove of puzzle.moves) {
            boardForPuzzleMoves.move(solutionMove, { sloppy: true })
          }
          // @ts-ignore
          setSolutionMoves(
            takeRight(
              boardForPuzzleMoves.history({ verbose: true }),
              puzzle.moves.length - 1
            )
          )
          // currentPosition.undo()

          setHiddenMoves(hiddenMoves)
          for (let i = 0; i < ply; i++) {
            currentPosition.undo()
          }
          setCurrentPosition(currentPosition)
          setFuturePosition(futurePosition)
          setShowFuturePosition(false)
          setFlipped(futurePosition.turn() === 'b')
          biref.setAvailableMoves([])
          break
        }
      }
    }
  }, [puzzle, ply])
  const [showFuturePosition, setShowFuturePosition] = useState(false)
  const nextPreviousStyles = s(c.size(60), c.center)
  const disabledNextPreviousStyles = s(c.buttons.disabled)
  const nextPreviousIconProps = {
    style: s(c.fg(c.colors.textInverse)),
    size: 28
  }
  const player = (
    <>
      <View style={s(c.row, c.alignStretch, c.fullWidth)}>
        <Button
          style={s(nextPreviousStyles)}
          onPress={() => {
            focusLastMove()
          }}
        >
          <i
            style={s(
              c.fg(c.colors.textPrimary),
              c.opacity(canFocusLastMove ? 90 : 50)
            )}
            className="fas fa-backward-step"
          ></i>
        </Button>
        <Button
          style={s(
            c.grow,
            c.mx(20),
            c.buttons.primary,
            c.py(0),
            c.fontSize(18)
          )}
          onPress={animateMoves}
        >
          <i style={s(c.fg(c.colors.textPrimary))} className="fas fa-play"></i>
        </Button>
        <Button
          style={s(nextPreviousStyles)}
          onPress={() => {
            focusNextMove()
          }}
        >
          <i
            style={s(
              c.fg(c.colors.textPrimary),
              c.opacity(canFocusNextMove ? 90 : 50)
            )}
            className="fas fa-forward-step"
          ></i>
        </Button>
      </View>
      <Spacer height={12} />
    </>
  )
  const speedButtonProps = useCallback(
    (ps) => {
      const props: any = {
        onPress: () => {
          setPlaybackSpeed(ps)
        }
      }
      if (ps == playbackSpeed) {
        props.style = s(c.buttons.basicInverse)
      } else {
        props.style = s(c.buttons.basic)
      }
      console.log('props', props)
      return props
    },
    [playbackSpeed]
  )
  return (
    <TrainerLayout
      chessboard={
        <ChessboardView
          {...{
            frozen: isEmpty(solutionMoves),
            biref,
            playbackSpeed,
            flipped,
            currentPosition,
            futurePosition,
            showFuturePosition
          }}
        />
      }
    >
      {progressMessage && (
        <>
          <View style={s(c.br(4), c.fullWidth)}>
            <Text
              style={s(
                c.fg(
                  progressMessage.type === ProgressMessageType.Error
                    ? c.colors.failureLight
                    : c.colors.successColor
                ),
                c.weightBold,
                c.fontSize(isMobile ? 14 : 16)
              )}
            >
              {progressMessage.message}
            </Text>
          </View>
          <Spacer height={12} />
        </>
      )}
      {!showFuturePosition && isMobile && player}
      <View style={s()}>
        <Text
          style={s(
            c.weightSemiBold,
            c.fg(c.colors.textPrimary),
            c.fontSize(isMobile ? 14 : 16)
          )}
        >
          {futurePosition.turn() == 'b' ? 'Black' : 'White'} to move. Visualize
          the following, or press play, then make the best move. Go to settings
          to adjust the difficulty.
        </Text>
        <Spacer height={12} />
        <Text>
          <MoveList
            focusedMoveIndex={focusedMoveIndex}
            moveList={hiddenMoves}
            onMoveClick={(move, i) => {
              setFocusedMoveIndex(i)
              biref.highlightMove(move)
            }}
          />
        </Text>
      </View>
      <Spacer height={24} />
      {!showFuturePosition && !isMobile && player}
      <View style={s(c.row, c.fullWidth, c.height(48))}>
        <Button
          style={s(c.buttons.basic, c.noBasis, c.grow)}
          onPress={() => {
            refreshPuzzle()
          }}
        >
          <Text style={s(c.buttons.basic.textStyles)}>
            <i
              style={s(c.fg(c.colors.textInverse))}
              className="fas fa-random"
            ></i>
            <Spacer width={8} />
            New puzzle
          </Text>
        </Button>
        <Spacer height={12} width={12} isMobile={isMobile} />
        <Button
          style={s(c.buttons.basic, c.noBasis, c.grow)}
          onPress={() => {
            ;(async () => {
              if (Platform.OS == 'web') {
                window.open(
                  `https://lichess.org/training/${puzzle.id}`,
                  '_blank'
                )
              }
            })()
          }}
        >
          <Text style={s(c.buttons.basic.textStyles)}>
            <i
              style={s(c.fg(c.colors.textInverse))}
              className="fas fa-external-link-alt"
            ></i>
            <Spacer width={8} />
            Lichess
          </Text>
        </Button>
        <Spacer height={12} width={12} isMobile={isMobile} />
        <Button
          style={s(c.buttons.basic, c.size(48))}
          onPress={() => {
            setSettingsOpen(true)
          }}
        >
          <i style={s(c.fg(c.colors.textInverse))} className="fas fa-gear"></i>
        </Button>
      </View>
      <Spacer height={12} />
      {debugButtons && (
        <>
          <Spacer height={12} />
          <Button
            style={c.buttons.basic}
            onPress={() => {
              biref.flashRing()
            }}
          >
            Flash ring
          </Button>
          <Spacer height={12} />
          <Button
            style={c.buttons.basic}
            onPress={() => {
              currentPosition.move(hiddenMoves[0])
              setHiddenMoves((s) => {
                s.shift()
                return s
              })
            }}
          >
            Advance one move
          </Button>
          <Spacer height={12} />
          <Button
            style={c.buttons.basic}
            onPress={() => {
              setShowFuturePosition(true)
            }}
          >
            Show future position
          </Button>
        </>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsOpen}
        onRequestClose={() => {
          setSettingsOpen(false)
        }}
      >
        <Pressable
          onPress={() => {
            setSettingsOpen(false)
          }}
          style={s(c.center, { flex: 1 }, c.bg('hsla(0, 0%, 0%, .5)'), c.br(2))}
        >
          <Pressable
            onPress={(e) => {
              e.stopPropagation()
            }}
            style={s(
              c.bg(c.grays[70]),
              c.br(2),
              c.column,
              c.unclickable,
              c.width(400),
              c.maxWidth('calc(100% - 50px)')
            )}
          >
            <View style={s(c.row, c.px(12), c.height(40), c.alignCenter)}>
              <Text
                style={s(
                  c.fontSize(20),
                  c.weightBold,
                  c.fg(c.colors.textInverse)
                )}
              >
                Settings
              </Text>
            </View>
            <View
              style={s(c.fullWidth, c.height(1), c.bg('black'), c.opacity(15))}
            ></View>
            <View style={s(c.px(12), c.pt(24), c.pb(24))}>
              <Text
                style={s(
                  c.fg(c.colors.textInverse),
                  c.fontSize(18),
                  c.weightBold
                )}
              >
                Hidden moves
              </Text>
              <Spacer height={12} />
              <View style={s(c.row, c.alignCenter)}>
                <Button
                  onPress={() => {
                    setPly(Math.max(1, ply - 1))
                  }}
                  style={s(incrementDecrementStyles)}
                >
                  -
                </Button>
                <Spacer width={12} />
                <View style={s(c.column, c.alignCenter, c.width(40))}>
                  <Text
                    style={s(
                      c.fg(c.colors.textInverse),
                      c.fontSize(24),
                      c.weightBold
                    )}
                  >
                    {ply}
                  </Text>
                </View>
                <Spacer width={12} />
                <Button
                  onPress={() => {
                    setPly(ply + 1)
                  }}
                  style={s(incrementDecrementStyles)}
                >
                  +
                </Button>
              </View>
              <Spacer height={24} />
              <Text
                style={s(
                  c.fg(c.colors.textInverse),
                  c.fontSize(18),
                  c.weightBold
                )}
              >
                Playback speed
              </Text>
              <Spacer height={12} />
              <View>
                <Button {...speedButtonProps(PlaybackSpeed.Slow)}>Slow</Button>
                <Button {...speedButtonProps(PlaybackSpeed.Normal)}>
                  Normal
                </Button>
                <Button {...speedButtonProps(PlaybackSpeed.Fast)}>Fast</Button>
                <Button {...speedButtonProps(PlaybackSpeed.Ludicrous)}>
                  Ludicrous
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </TrainerLayout>
  )
}
