import { SchemaLink } from "@apollo/client/link/schema";
import { makeExecutableSchema } from "@graphql-tools/schema";

import gql from "graphql-tag";

export const schemaLink = new SchemaLink({
  schema: makeExecutableSchema({ typeDefs }),
});
