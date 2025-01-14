import { isLoggedInVar } from "../apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../pages/login";
import CreateAccount from "../pages/create-account";

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
        </Switch>
      </BrowserRouter>
    </>
  );
};
