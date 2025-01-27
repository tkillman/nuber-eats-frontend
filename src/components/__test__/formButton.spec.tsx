import { render, screen } from "@testing-library/react";
import FormButton from "../FormButton";

describe("FormButton", () => {
  it("랜더링 FormButton 테스트", () => {
    const { rerender } = render(
      <FormButton isValid={true} loading={false} text={"hi"} />
    );
    screen.getByText("hi");
    // rerender(<FormButton isValid={true} loading={true} text={"hi"} />);
    // screen.getByText("로딩중");
  });

  it("loading이 true, isValid가 false 일 때 테스트", () => {
    const {
      container: { firstChild },
    } = render(<FormButton isValid={false} loading={true} text={"hi"} />);
    screen.getByText("로딩중");
    //expect(container.firstChild).toHaveClass("bg-gray-300 pointer-events-none");
    expect(firstChild).toHaveClass("bg-gray-300 pointer-events-none");
  });
});
