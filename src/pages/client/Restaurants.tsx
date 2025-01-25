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
  const { data, loading } = useQuery<
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
      <form className="bg-gray-800 w-full py-10 flex items-center justify-center">
        <input
          type="text"
          className="input border-0 w-3/12"
          placeholder="레스토랑 검색"
        ></input>
      </form>
      {!loading && (
        <div className="container mx-auto">
          <div className="flex justify-around max-w-xl mx-auto">
            {data?.allCategories?.categories?.map((category) => {
              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full group-hover:bg-green-400 flex items-center justify-center">
                    <div
                      className="w-14 h-14 bg-cover rounded-full"
                      style={{ backgroundImage: `url(${category.coverImage})` }}
                    ></div>
                  </div>
                  <span className="mt-1 text-sm text-center font-medium">
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-10">
            {data?.allRestaurants?.results?.map((restaurant) => (
              <div key={restaurant.id} className="">
                <div
                  className="bg-red-600 py-20 mb-3 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${restaurant.coverImage})`,
                  }}
                ></div>
                <h3 className="text-xl font-medium">{restaurant.name}</h3>
                <span>{restaurant.category?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
