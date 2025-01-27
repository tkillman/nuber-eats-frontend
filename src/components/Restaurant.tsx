import { FC } from "react";
import { RestaurantPartsFragment } from "../__generated__/graphql";
import { Link } from "react-router-dom";
import { RouterPath } from "../routes/routerPath";

interface RestaurantProps {
  restaurant?: Pick<
    RestaurantPartsFragment,
    "id" | "coverImage" | "category" | "name"
  > | null;
}

const RestaurantComponent: FC<RestaurantProps> = ({ restaurant }) => {
  return (
    <Link to={`${RouterPath.RESTAURANT_DETAIL}/${restaurant?.id}`}>
      <div key={restaurant?.id} className="flex flex-col">
        <div
          className="bg-red-600 py-20 mb-3 bg-cover bg-center"
          style={{
            backgroundImage: `url(${restaurant?.coverImage})`,
          }}
        ></div>
        <h3 className="text-xl font-medium">{restaurant?.name}</h3>
        <span className="border-t border-gray-400 mt-3 py-2 text-xs opacity-50">
          {restaurant?.category?.name}
        </span>
      </div>
    </Link>
  );
};

export default RestaurantComponent;
