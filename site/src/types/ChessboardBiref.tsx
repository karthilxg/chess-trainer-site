export interface ChessboardBiref {
  setAvailableMoves?: (_: Move[]) => void;
  flashRing?: (_?: boolean) => void;
  highlightMove?: (_: Move, _: () => void) => void;
}
