import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
  Redirect,
} from "react-router-dom";
import { MeQuery } from "../__generated__/graphql";
import Restaurants from "../pages/client/Restaurants";
import Header from "../components/Header";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
    }
  }
`;

const ClientRouter = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);

  if (!data || loading || error) {
    return <div>loading</div>;
  }
  console.log("data", data);
  return (
    <BrowserRouter>
      <Header />
      <Switch>{data.me.role === "Client" && ClientRouter}</Switch>
      <Redirect to="/" />
    </BrowserRouter>
  );
};
