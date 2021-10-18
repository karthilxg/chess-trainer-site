import React from "react";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
  useTheme,
} from "@ui-kitten/components";
import useDesign from "./src/design";
import TopNav from "./src/TopNav";
import Space from "./Space";
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
import { Home } from "@src/components/Home";
import { NavigationContainer } from "@react-navigation/native";
import { AuthSuccess } from "@src/components/AuthSuccess";


const config = {
  screens: {
    AuthSuccess: 'lichess_oauth_success',
  },
};

const linking = {
  prefixes: [],
  config,
};


const Stack = createNativeStackNavigator();

export default () => (
  <View style={{ backgroundColor: "black" }}>

    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={{ backgroundColor: "black" }}>
          <NavigationContainer linking={linking}>
            <Home />
            {/*
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AuthSuccess" component={AuthSuccess} />
          </Stack.Navigator>
          */}
          </NavigationContainer>
        </Layout>

      </ApplicationProvider>
    </>
  </View >
);
