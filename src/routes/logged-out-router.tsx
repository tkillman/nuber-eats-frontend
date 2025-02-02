import { isLoggedInVar } from "../apollo";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/confirm-email">
            <ConfirmEmail />
          </Route>
          <Redirect to="/login" />
          {/* <Route>
            <NotFound />
          </Route> */}
        </Switch>
      </BrowserRouter>
    </>
  );
};
