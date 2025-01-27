/* eslint-disable testing-library/no-render-in-setup */
import { ApolloProvider } from "@apollo/client";
import { customRender } from "../../test-utils";
import CreateAccount from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { RenderResult } from "@testing-library/react";

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

  it("should render OK", () => {});
});
