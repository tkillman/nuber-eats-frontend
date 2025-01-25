import { FC } from "react";
import { Restaurant, RestaurantsQueryQuery } from "../__generated__/graphql";

interface RestaurantProps {
  restaurant?: {
    __typename?: "Restaurant";
    id: number;
    name: string;
    coverImage: string;
    address: string;
    isPromoted: boolean;
    category?: { __typename?: "Category"; name: string } | null;
  } | null;
}

const RestaurantComponent: FC<RestaurantProps> = ({ restaurant }) => {
  return (
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
  );
};

export default RestaurantComponent;
