/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-wait-for-side-effects */
import { render, RenderResult, waitFor, screen } from "@testing-library/react";
import Login, { LOGIN_MUTATION } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;

  beforeEach(() => {
    mockClient = createMockClient();
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

  it("비밀번호 폼 테스트", async () => {
    const emailElement = screen.getByPlaceholderText(/email/i);
    userEvent.type(emailElement, "timekillman@gmail.com");

    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor(() => {
      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        screen.queryByText("비밀번호는 필수 입력 사항입니다.")
      ).toBeInTheDocument();
    });
  });

  it("로그인 폼 제출 테스트", async () => {
    const formData = {
      email: "test@gmail.com",
      password: "1234",
    };
    const emailElement = screen.getByPlaceholderText(/email/i);
    userEvent.type(emailElement, formData.email);
    const passwordElement = screen.getByPlaceholderText(/password/i);
    userEvent.type(passwordElement, formData.password);
    const button = screen.getByRole("button");
    userEvent.click(button);

    const mockResponse = jest.fn().mockResolvedValue({
      data: {
        login: { ok: true, token: "XX", error: null },
      },
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, mockResponse);

    await waitFor(() => {
      expect(mockResponse).toHaveBeenCalledTimes(1);
      expect(mockResponse).toHaveBeenCalledWith({
        loginInput: {
          ...formData,
        },
      });
    });
  });
});
