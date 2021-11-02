import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Text,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  Modal as NativeModal
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
import KingWhiteIcon from './chessboard/pieces/KingWhiteIcon'
import KingBlackIcon from './chessboard/pieces/KingBlackIcon'

export const Modal = ({
  onClose,
  visible,
  children
}: {
  onClose: () => void
  visible
  children: any
}) => {
  return (
    <NativeModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose()
      }}
    >
      <Pressable
        onPress={() => {
          onClose()
        }}
        style={s(c.center, { flex: 1 }, c.bg('hsla(0, 0%, 0%, .5)'), c.br(2))}
      >
        <Pressable
          onPress={(e) => {
            e.stopPropagation()
          }}
          style={s(
            c.bg(c.grays[15]),
            c.br(2),
            c.column,
            c.unclickable,
            c.width(400),
            c.maxWidth('calc(100% - 50px)')
          )}
        >
          {children}
        </Pressable>
      </Pressable>
    </NativeModal>
  )
}
