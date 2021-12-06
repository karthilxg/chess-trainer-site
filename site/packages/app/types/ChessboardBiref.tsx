import { Chess, Move } from '@lubert/chess.ts'
import { Square } from '@lubert/chess.ts/dist/types'
import { UpdatadableState } from '../utils/useImmer'

export interface ChessboardState {
  futurePosition?: Chess
  currentPosition?: Chess
  flipped?: boolean
  showFuturePosition?: boolean
}

export interface ChessboardBiref {
  setAvailableMoves?: (m: Move[]) => void
  flashRing?: (success?: boolean) => void
  highlightSquare?: (square: Square) => void
  highlightMove?: (
    move: Move,
    backwards?: boolean,
    cb?: () => void,
    flipped?: boolean
  ) => void
  animateMove?: (move: Move) => void
  attemptSolution?: (move: Move) => void
}
