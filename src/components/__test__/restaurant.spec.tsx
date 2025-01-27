import { render, screen } from "@testing-library/react";
import RestaurantComponent from "../Restaurant";
import { RouterPath } from "../../routes/routerPath";
import { BrowserRouter } from "react-router-dom";

describe("Restaurant", () => {
  it("레스토랑 컴포넌트 랜더링 테스트", () => {
    const restaurantProps = {
      id: 1,
      name: "name",
      category: {
        name: "categoryName",
      },
      coverImage: "coverImg",
    };
    const {
      container: { firstChild },
    } = render(
      <BrowserRouter>
        <RestaurantComponent restaurant={restaurantProps} />
      </BrowserRouter>
    );
    screen.getByText("name");
    screen.getByText("categoryName");

    expect(firstChild).toHaveAttribute(
      "href",
      `${RouterPath.RESTAURANT_DETAIL}/${restaurantProps.id}`
    );
  });
});
