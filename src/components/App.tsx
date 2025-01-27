import React from "react";
import { LoggedOutRouter } from "../routes/logged-out-router";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { LoggedInRouter } from "../routes/logged-in-router";
import { isLoggedInVar } from "../apollo";

// const IS_LOGGED_IN = gql`
//   query isLoggedIn {
//     isLoggedIn @client
//   }
// `;

const App = () => {
  // const {
  //   data: { isLoggedIn },
  // } = useQuery(IS_LOGGED_IN);

  // console.log(isLoggedIn);

  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};

export default App;
