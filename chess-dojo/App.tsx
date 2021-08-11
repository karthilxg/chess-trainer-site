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
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Space from "./Space";
import { View } from "react-native";
import { ChessboardView } from "./src/chessboard/Chessboard";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { GraphqlProvider } from "@src/graphql/GraphqlProvider";
import { GET_COMMUNITY_REPERTOIRES } from "@src/graphql/queries";
import { GetCommunityRepertoires } from "@src/graphql/__generated__/GetCommunityRepertoires";
// import { ExchangeRates } from "@src/ExchangeRate";

const App = () => {
  const theme = useTheme();
  const {
    data: repertoires,
    loading,
    error,
  } = useQuery<GetCommunityRepertoires>(GET_COMMUNITY_REPERTOIRES);
  const design = useDesign();
  console.log(repertoires);
  console.log(error);
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: design.backgroundColor,
      }}
    >
      <TopNav />
      <Space height={42} grow />
      <Text category="h1">HOME</Text>
      <Text category="p" style={{ color: design.textPrimary }}>
        This is some body text
      </Text>
      <Text category="p" style={{ color: design.textAlternate }}>
        This is some body text
      </Text>
      <Space height={12} />

      <Space height={12} />
      <View
        style={{
          width: 500,
          height: 500,
          borderRadius: 4,
          shadowColor: "black",
          shadowOpacity: 0.4,
          shadowRadius: 10,
          backgroundColor: design.backgroundColorSecondary,
        }}
      >
        <ChessboardView />
      </View>
      <Space height={42} grow />
    </Layout>
  );
};

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.dark}>
      <GraphqlProvider useMocks>
        <App />
      </GraphqlProvider>
    </ApplicationProvider>
  </>
);
