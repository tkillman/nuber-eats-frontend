import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { isLoggedInVar } from "../../apollo";

jest.mock("../../routes/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>LoggedOut</span>,
  };
});

jest.mock("../../routes/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>LoggedIn</span>,
  };
});

describe("<App/>", () => {
  it("랜더링 LoggedOutRouter 테스트", () => {
    render(<App />);
    //debug();
    screen.getByText("LoggedOut");
  });

  it("랜더링 LoggedInRouter 테스트", async () => {
    const { debug } = render(<App />);

    // (debug as any)();

    await waitFor(() => {
      isLoggedInVar(true);
    });
    screen.getByText("LoggedIn");
  });
});
