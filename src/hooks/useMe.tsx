import { gql, useQuery } from "@apollo/client";
import { MeQuery, MeQueryVariables } from "../__generated__/graphql";

export const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery, MeQueryVariables>(ME_QUERY, {
    //fetchPolicy: "no-cache",
  });
};
