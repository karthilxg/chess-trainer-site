export interface LichessPuzzle {
  id: string;
  moves: string[];
  fen: string,
  popularity: number,
  tags: string[],
  gameLink: string,
  rating: number,
  ratingDeviation: number,
  numberPlays: number,
  allMoves: string[],
  maxPly: number,
}

