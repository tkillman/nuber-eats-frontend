import { isLoggedInVar } from "../apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../pages/login";
import CreateAccount from "../pages/create-account";
import NotFound from "../pages/404";
import ConfirmEmail from "../pages/user/confirm-email";

export const LoggedOutRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/create-account" exact>
            <CreateAccount />
          </Route>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/confirm-email">
            <ConfirmEmail />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};
