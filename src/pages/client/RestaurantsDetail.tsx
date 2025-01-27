import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import {
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
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

type RestaurantsDetailParams = {
  id: string;
};

const RestaurantsDetail = () => {
  const param = useParams<RestaurantsDetailParams>();
  console.log("🚀 ~ RestaurantsDetail ~ param:", param);

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

  console.log("🚀 ~ RestaurantsDetail ~ data:", data);

  return <div>rd</div>;
};

export default RestaurantsDetail;
