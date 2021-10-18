import React, { useEffect, useState } from "react";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
  useTheme,
} from "@ui-kitten/components";
// import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Platform, Pressable, View } from "react-native";
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
// import { ChessboardView } from "@src/chessboard/Chessboard";
import axios from "axios";
import { Helmet } from "react-helmet"

interface LichessPuzzle {
  id: string;
  moves: string;
  fen: string,
  popularity: number,
  tags: string[],
  game_link: string,
  rating: number,
  rating_deviation: number,
  number_plays: number,
  all_moves: string[],
  max_ply: number,
}
const fakePuzzle = {

  "id": "005HF",
  "moves": [
    "exf4",
    "Nf3",
    "d6",
    "Bc4"
  ],
  "fen": "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2",
  "popularity": 65,
  "tags": [
    "crushing",
    "defensiveMove",
    "hangingPiece",
    "middlegame",
    "short"
  ],
  "gameLink": "https://lichess.org/IqVPsfjB#53",
  "rating": 1375,
  "ratingDeviation": 83,
  "numberPlays": 37,
  "allMoves": [
    "e4",
    "e5",
    "f4",
    "exf4",
    "Nf3",
    "d6",
    "Bc4"
  ],
  "maxPly": 52
}

export const Home = () => {
  const theme = useTheme();
  // const {
  //   data: repertoires,
  //   loading,
  //   error,
  // } = useQuery<GetCommunityRepertoires>(GET_COMMUNITY_REPERTOIRES);
  const design = useDesign();
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = design.backgroundColor
      //       const script = document.createElement('script');

      //       script.src = "https://ackee.mbuffett.com/tracker.js";
      //       script.async = true;
      //       script.setAttribute("data-ackee-server", "https://ackee.mbuffett.com")
      //       script.setAttribute("data-data-ackee-domain-id", "70e91043-cea0-45ab-8b7b-1d3a2297311e")

      //       document.head.appendChild(script);

      //       return () => {
      //         document.head.removeChild(script);
      //       }
    }
  }, [])
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: design.backgroundColor,
      }}
    >
    </Layout>
  );
};
