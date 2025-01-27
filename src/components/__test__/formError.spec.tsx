import { render, screen } from "@testing-library/react";
import FormError from "../FormError";

describe("FormError", () => {
  it("should render", () => {
    const errorMessage = "error message";
    render(<FormError errorMessage={errorMessage} />);
    screen.getByText(errorMessage);
  });
  it("에러 메시지 없을 때 테스트", () => {
    const {
      container: { firstChild },
    } = render(<FormError errorMessage={null} />);
    expect(firstChild).toBeNull();
  });
});
