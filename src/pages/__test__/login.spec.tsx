/* eslint-disable testing-library/no-wait-for-side-effects */
import { render, RenderResult, waitFor, screen } from "@testing-library/react";
import Login from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    const mockClient = createMockClient();
    // eslint-disable-next-line testing-library/no-render-in-setup
    renderResult = render(
      <HelmetProvider>
        <BrowserRouter>
          <ApolloProvider client={mockClient}>
            <Login />
          </ApolloProvider>
        </BrowserRouter>
      </HelmetProvider>
    );
  });

  it("로그인 페이지 랜더링 테스트", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("이메일 입력 폼 테스트", async () => {
    const { debug } = renderResult;
    const emailElement = screen.getByPlaceholderText(/email/i);
    userEvent.type(emailElement, "taf@wont");
    await waitFor(() => {
      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        screen.queryByText("이메일 패턴이 안 맞음")
      ).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-debugging-utils
    //debug();

    userEvent.clear(emailElement);

    await waitFor(() => {
      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        screen.queryByText("이메일은 필수 입력 사항입니다.")
      ).toBeInTheDocument();
    });
  });
});
