import React from "react";
import * as eva from "@eva-design/eva";
import { Pressable, View } from "react-native";
import { ChessboardView } from "./src/chessboard/Chessboard";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { api } from "@src/utils/frisbee";
// import { ExchangeRates } from "@src/ExchangeRate";
import { s, c } from "@src/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VisualizationTraining } from "@src/components/VisualizationTraining";
import { NavigationContainer } from "@react-navigation/native";
import { Helmet } from "react-helmet";

const config = {
  screens: {
    AuthSuccess: "lichess_oauth_success",
  },
};

const linking = {
  prefixes: [],
  config,
};

const Stack = createNativeStackNavigator();
// <Stack.Screen name="Streak" component={Streak} />

export default () => (
  <View nativeID="Blah">
    <Helmet>
      <script
        async
        src="https://ackee.mbuffett.com/tracker.js"
        data-ackee-server="https://ackee.mbuffett.com"
        data-ackee-domain-id="70e91043-cea0-45ab-8b7b-1d3a2297311e"
      ></script>
    </Helmet>
    <>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="visualization">
          <Stack.Screen
            name="visualization"
            component={VisualizationTraining}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  </View>
);
