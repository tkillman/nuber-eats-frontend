import { render, waitFor } from "@testing-library/react";
import NotFound from "../404";
import { HelmetProvider } from "react-helmet-async";

describe("404", () => {
  it("404 페이지 랜더링 테스트", async () => {
    render(
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toBe("Page Not Found");
    });
  });
});
