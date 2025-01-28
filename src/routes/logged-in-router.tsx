import { BrowserRouter, Route, Switch } from "react-router-dom";
import { UserRole } from "../__generated__/graphql";
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
import MyRestaurants from "../pages/owner/MyRestaurants";
import AddRestaurant from "../pages/owner/AddRestaurant";

type IRouter = {
  path: string;
  component: JSX.Element;
  exact?: boolean;
};

const clientRouters: IRouter[] = [
  {
    path: RouterPath.HOME,
    component: <Restaurants />,
    exact: true,
  },
  {
    path: RouterPath.SEARCH,
    component: <Search />,
    exact: true,
  },
  {
    path: `${RouterPath.CATEGORY}/:slug`,
    component: <Category />,
    exact: true,
  },
  {
    path: `${RouterPath.RESTAURANT_DETAIL}/:id`,
    component: <RestaurantsDetail />,
    exact: true,
  },
];

const ownerRouters: IRouter[] = [
  {
    path: RouterPath.HOME,
    component: <MyRestaurants />,
    exact: true,
  },
  {
    path: RouterPath.ADD_RESTAURANT,
    component: <AddRestaurant />,
    exact: true,
  },
];

const commonRouters: IRouter[] = [
  {
    path: RouterPath.CONFIRM_EMAIL,
    component: <ConfirmEmail />,
    exact: true,
  },
  {
    path: RouterPath.MY_PROFILE,
    component: <MyProfile />,
    exact: true,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return <div>loading</div>;
  }

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRouters.map((router) => {
            return (
              <Route key={router.path} path={router.path} exact={router.exact}>
                {router.component}
              </Route>
            );
          })}
        {data.me.role === UserRole.Owner &&
          ownerRouters.map((router) => {
            return (
              <Route key={router.path} path={router.path} exact={router.exact}>
                {router.component}
              </Route>
            );
          })}
        {commonRouters.map((router) => {
          return (
            <Route key={router.path} path={router.path} exact={router.exact}>
              {router.component}
            </Route>
          );
        })}
        <Route key={"999"}>
          <NotFound />
        </Route>
      </Switch>
      {/* <Redirect to="/" /> */}
    </BrowserRouter>
  );
};
