import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Text,
  Platform,
  Pressable,
  useWindowDimensions,
  View
} from 'react-native'
// import { ExchangeRates } from "app/ExchangeRate";
import { c, s } from 'app/styles'
import { Spacer } from 'app/Space'
import {
  ChessboardView,
  getAnimationDurations,
  getPlaybackSpeedDescription,
  PlaybackSpeed
} from 'app/components/chessboard/Chessboard'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import { useImmer } from 'use-immer'
import { Chess, Move } from '@lubert/chess.ts'
import client from 'app/client'
import {
  cloneDeep,
  isEmpty,
  isNil,
  takeRight,
  drop,
  dropRight,
  indexOf
} from 'lodash'
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
import KingWhiteIcon from './chessboard/pieces/KingWhiteIcon'
import KingBlackIcon from './chessboard/pieces/KingBlackIcon'
import { Modal } from 'app/components/Modal'
import { intersperse } from '../utils/intersperse'
import { useVisualizationTraining } from '../utils/useVisualizationTraining'

export const VisualizationTraining = () => {
  const { chessboardProps, ui } = useVisualizationTraining({})
  return (
    <TrainerLayout chessboard={<ChessboardView {...chessboardProps} />}>
      {ui}
    </TrainerLayout>
  )
}
