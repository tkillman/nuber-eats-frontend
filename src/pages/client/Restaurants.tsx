import { gql, useQuery } from "@apollo/client";
import {
  RestaurantsQueryQuery,
  RestaurantsQueryQueryVariables,
} from "../../__generated__/graphql";

const RESTAURANTS_QUERY = gql`
  query restaurantsQuery($input: AllRestaurantInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }

    allRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

const Restaurants = () => {
  const { data } = useQuery<
    RestaurantsQueryQuery,
    RestaurantsQueryQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

  console.log(data);

  return (
    <div>
      <h1>Restaurants</h1>
    </div>
  );
};

export default Restaurants;
