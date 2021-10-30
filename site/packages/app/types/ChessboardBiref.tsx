import { Move } from '@lubert/chess.ts'
import { Square } from '@lubert/chess.ts/dist/types'

export interface ChessboardBiref {
  setAvailableMoves?: (m: Move[]) => void
  flashRing?: (success?: boolean) => void
  highlightSquare?: (square: Square) => void
  highlightMove?: (move: Move, backwards?: boolean, cb?: () => void) => void
  attemptSolution?: (move: Move) => void
}
