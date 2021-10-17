import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloProvider, gql } from "@apollo/client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { repertoiresQueryMock } from "./mocks";
import Constants from "expo-constants";
// import { booksQueryMock } from "./mocks";

const client = new ApolloClient({
  uri: `${Constants.manifest.extra.serverUrl}/graphql`,
  cache: new InMemoryCache(),
});

interface ProviderProps {
  useMocks?: boolean;
}

export const GraphqlProvider: React.FC<ProviderProps> = ({
  useMocks,
  children,
}) => {
  if (useMocks)
    return (
      <MockedProvider mocks={[repertoiresQueryMock]}>
        <>{children}</>
      </MockedProvider>
    );
  return (
    <ApolloProvider client={client}>
      <>{children}</>
    </ApolloProvider>
  );
};
