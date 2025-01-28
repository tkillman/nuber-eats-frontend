import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { MyRestaurantsOutput } from "../../__generated__/graphql";

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
    ${RESTAURANT_FRAGMENT}
`;

const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsOutput>(MY_RESTAURANTS_QUERY);
  console.log("🚀 ~ MyRestaurants ~ data:", data);
  return <div>MyRestaurants</div>;
};

export default MyRestaurants;
