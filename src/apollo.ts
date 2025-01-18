// https://www.apollographql.com/docs/react/get-started
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  makeVar,
} from "@apollo/client";
import { LOCAL_STORAGE_TOKEN } from "./constant/constant";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          authTokenVar: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
