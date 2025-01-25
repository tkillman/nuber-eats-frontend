import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
  Redirect,
} from "react-router-dom";
import { MeQuery, UserRole } from "../__generated__/graphql";
import Restaurants from "../pages/client/Restaurants";
import Header from "../components/Header";
import { useMe } from "../hooks/useMe";
import MyProfile from "../pages/user/my-profile";
import ConfirmEmail from "../pages/user/confirm-email";
import { RouterPath } from "./routerPath";
import NotFound from "../pages/404";
import Search from "../pages/client/Search";

const ClientRouter = [
  <Route key={"1"} path={RouterPath.HOME}>
    <Restaurants />
  </Route>,
  <Route key={"2"} path={RouterPath.MY_PROFILE}>
    <MyProfile />
  </Route>,
  <Route key={"3"} path={RouterPath.CONFIRM_EMAIL}>
    <ConfirmEmail />
  </Route>,
  <Route key={"4"} path={RouterPath.SEARCH}>
    <Search />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return <div>loading</div>;
  }

  return (
    <BrowserRouter>
      <Header />
      <Switch>{data.me.role === UserRole.Client && ClientRouter}</Switch>

      {/* <Redirect to="/" /> */}
      <Route>
        <NotFound />
      </Route>
    </BrowserRouter>
  );
};
