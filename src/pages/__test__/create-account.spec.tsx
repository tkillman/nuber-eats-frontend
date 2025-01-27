/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-render-in-setup */
import { ApolloProvider } from "@apollo/client";
import { customRender } from "../../test-utils";
import CreateAccount, { CREATE_USER_MUTATION } from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { RenderResult, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/graphql";

describe("CreateAccount", () => {
  let mockClient: MockApolloClient;
  let view: RenderResult;
  beforeEach(() => {
    mockClient = createMockClient();

    view = customRender(
      <ApolloProvider client={mockClient}>
        <CreateAccount />
      </ApolloProvider>
    );
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("CreateAccount | Nuber Eats");
    });
  });

  it("이메일 폼 테스트", async () => {
    //const { getByPlaceholderText } = view;
    const email = screen.getByPlaceholderText("email");

    userEvent.type(email, "asdf");

    await waitFor(() => {
      screen.getByText("이메일 패턴이 안 맞음");
    });

    userEvent.clear(email);
    await waitFor(() => {
      screen.getByText("Email is required");
    });
  });
  it("패스워드 폼 테스트", async () => {
    const email = screen.getByPlaceholderText("email");

    userEvent.type(email, "test@gmail.com");
    const password = screen.getByPlaceholderText("password");
    userEvent.type(password, "1234");

    userEvent.clear(password);

    await waitFor(() => {
      screen.getByText("Password is required");
    });
  });

  it("계정생성 제출 테스트", async () => {
    const formData = {
      email: "test@gmail.com",
      password: "1234",
      role: UserRole.Client,
    };
    const email = screen.getByPlaceholderText("email");

    userEvent.type(email, formData.email);
    const password = screen.getByPlaceholderText("password");
    userEvent.type(password, formData.password);

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    const mockResponse = jest.fn().mockResolvedValue({
      data: {
        createUser: {
          ok: true,
          error: null,
        },
      },
    });

    mockClient.setRequestHandler(CREATE_USER_MUTATION, mockResponse);

    await waitFor(() => {
      expect(mockResponse).toHaveBeenCalledTimes(1);
      expect(mockResponse).toHaveBeenCalledWith({});
    });
  });
});
