// https://www.apollographql.com/docs/react/get-started
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  makeVar,
  createHttpLink,
} from "@apollo/client";
import { LOCAL_STORAGE_TOKEN } from "./constant/constant";
import { setContext } from "@apollo/client/link/context";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
