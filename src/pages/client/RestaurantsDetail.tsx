import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  RestaurantPartsFragment,
  RestaurantQueryQuery,
  RestaurantQueryQueryVariables,
} from "../../__generated__/graphql";

const RESTARAUNT_QUERY = gql`
  query RestaurantQuery($input: RestaurantInput!) {
    Restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

type RestaurantsDetailParams = {
  id: string;
};

const RestaurantsDetail = () => {
  const param = useParams<RestaurantsDetailParams>();

  const { data } = useQuery<
    RestaurantQueryQuery,
    RestaurantQueryQueryVariables
  >(RESTARAUNT_QUERY, {
    variables: {
      input: {
        restaurantId: +param.id,
      },
    },
  });

  const restaurant = data?.Restaurant.restaurant as
    | RestaurantPartsFragment
    | undefined;

  console.log(restaurant);

  return (
    <div>
      <div
        className="bg-red-500 bg-center bg-cover py-24"
        style={{
          backgroundImage: `url(${restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-4 pl-48">
          <h4 className="text-4xl mb-3">{restaurant?.name}</h4>
          <h5 className="text-sm font-light">{restaurant?.category?.name}</h5>
          <h6>{restaurant?.address}</h6>
        </div>
      </div>
      <div className="container">
        <h4>메뉴</h4>
        <div></div>
      </div>
    </div>
  );
};

export default RestaurantsDetail;
