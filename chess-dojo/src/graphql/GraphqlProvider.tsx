import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloProvider } from "@apollo/client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { repertoiresQueryMock } from "./mocks";
// import { booksQueryMock } from "./mocks";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
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
