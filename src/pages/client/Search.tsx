import { FC, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import {
  SearchRestaurantsQueryQuery,
  SearchRestaurantsQueryQueryVariables,
} from "../../__generated__/graphql";

const SEARCH_RESTAURANTS_QUERY = gql`
  query searchRestaurantsQuery($input: SearchRestaurantInput!) {
    searchRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface SearchProps {}

const Search: FC<SearchProps> = () => {
  const location = useLocation();
  const history = useHistory();

  const [search, { data, loading, called, refetch }] = useLazyQuery<
    SearchRestaurantsQueryQuery,
    SearchRestaurantsQueryQueryVariables
  >(SEARCH_RESTAURANTS_QUERY, {});

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ location.search:", location.search);
    const [_, searchTerm] = location.search.split("?term=");
    console.log("🚀 ~ useEffect ~ searchTerm:", searchTerm);
    if (searchTerm) {
      search({
        variables: {
          input: {
            page: 1,
            query: searchTerm,
          },
        },
      });
    } else {
      history.replace(RouterPath.HOME);
    }
  }, [location, history]);

  return <div>Search</div>;
};

export default Search;
