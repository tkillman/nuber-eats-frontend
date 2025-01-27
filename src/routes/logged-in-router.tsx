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
import Category from "../pages/client/Category";
import RestaurantsDetail from "../pages/client/RestaurantsDetail";

const ClientRouter = [
  <Route key={RouterPath.HOME} path={RouterPath.HOME} exact>
    <Restaurants />
  </Route>,
  <Route key={RouterPath.MY_PROFILE} path={RouterPath.MY_PROFILE} exact>
    <MyProfile />
  </Route>,
  <Route key={RouterPath.CONFIRM_EMAIL} path={RouterPath.CONFIRM_EMAIL} exact>
    <ConfirmEmail />
  </Route>,
  <Route key={RouterPath.SEARCH} path={RouterPath.SEARCH} exact>
    <Search />
  </Route>,
  <Route key={RouterPath.CATEGORY} path={`${RouterPath.CATEGORY}/:slug`}>
    <Category />
  </Route>,
  <Route
    key={RouterPath.RESTAURANT_DETAIL}
    path={`${RouterPath.RESTAURANT_DETAIL}/:id`}
  >
    <RestaurantsDetail />
  </Route>,
  <Route key={"999"}>
    <NotFound />
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
      {/* <Route key={"999"}>
        <NotFound />
      </Route> */}
    </BrowserRouter>
  );
};
