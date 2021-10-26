import { Move } from "@lubert/chess.ts";

export interface ChessboardBiref {
  setAvailableMoves?: (m: Move[]) => void;
  flashRing?: (success?: boolean) => void;
  highlightMove?: (move: Move, backwards?: boolean, cb?: () => void) => void;
}
