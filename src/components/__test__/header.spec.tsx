import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor, screen } from "@testing-library/react";
import Header from "../Header";
import { BrowserRouter } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";

describe("Header", () => {
  it("verified가 false일 때 인증 배너 있음 테스트", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: false,
                },
              },
            },
          },
        ]}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(async () => {
      screen.getByText("인증받아");
      return new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it("verified가 true일 때 인증 배너 없음 테스트", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(async () => {
      expect(screen.queryAllByText("인증받아")).toHaveLength(0);
      return new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
