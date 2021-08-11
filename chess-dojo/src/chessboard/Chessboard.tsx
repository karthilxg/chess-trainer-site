import React, { useState } from "react";
import { View } from "react-native";
import { c, s } from "@src/styles";
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
import { Chess } from "@lubert/chess.ts";

const lightTileColor = s.hsl(180, 20, 70);
const darkTileColor = s.hsl(180, 20, 40);

enum ChessPiece {
  Pawn = "p",
  Rook = "r",
  Knight = "n",
  Bishop = "b",
  Queen = "q",
  King = "k",
}

enum ChessColor {
  White = "w",
  Black = "b",
}

const getIconForPiece = (piece: ChessPiece, color: ChessColor) => {
  switch (color) {
    case ChessColor.Black:
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
    case ChessColor.White:
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
  piece: ChessPiece;
  color: ChessColor;
}) => {
  return <View>{getIconForPiece(piece, color)}</View>;
};

const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rows = [1, 2, 3, 4, 5, 6, 7, 8];

export const ChessboardView = ({}) => {
  const tileStyles = c(s.bg("green"), s.grow);
  let [chess] = useState(new Chess());
  let [availableMoves, setAvailableMoves] = useState([]);
  return (
    <View style={c(s.column, s.fullWidth, s.fullHeight)}>
      {times(8)((i) => {
        return (
          <View style={c(s.fullWidth, s.bg("red"), s.row, s.grow, s.flexible)}>
            {times(8)((j) => {
              let color = (i + j) % 2 == 0 ? lightTileColor : darkTileColor;
              let square = `${columns[j]}${rows[7 - i]}`;
              let piece = chess.get(square);
              let pieceView = null;
              if (piece) {
                pieceView = (
                  <PieceView piece={piece["type"]} color={piece["color"]} />
                );
              }
              let availableMove = availableMoves.find((m) => m.to == square);
              return (
                <View
                  style={c(tileStyles, s.bg(color), s.center, s.flexible)}
                  onStartShouldSetResponder={() => {
                    if (availableMove) {
                      chess.move(availableMove);
                      setAvailableMoves([]);
                      return;
                    }
                    let moves = chess.moves({ square, verbose: true });
                    console.log("moves", moves);
                    setAvailableMoves(moves);
                  }}
                >
                  {availableMove &&
                    (availableMove.captured ? (
                      <View
                        style={c(
                          s.size("100%"),
                          s.opacity(30),
                          s.bg("blue"),
                          s.absolute
                        )}
                      />
                    ) : (
                      <View
                        style={c(
                          s.size("30%"),
                          s.opacity(30),
                          s.bg("blue"),
                          s.absolute
                        )}
                      />
                    ))}
                  {pieceView}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
