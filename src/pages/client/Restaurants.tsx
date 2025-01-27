import { gql, useQuery } from "@apollo/client";
import {
  CategoryPartsFragment,
  RestaurantPartsFragment,
  RestaurantsQueryQuery,
  RestaurantsQueryQueryVariables,
} from "../../__generated__/graphql";
import Restaurant from "../../components/Restaurant";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";

interface IForm {
  searchTerm: string;
}

const RESTAURANTS_QUERY = gql`
  query restaurantsQuery($input: AllRestaurantInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }

    allRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

const Restaurants = () => {
  const [page, setPage] = useState(1);

  const { register, getValues, handleSubmit } = useForm<IForm>({
    defaultValues: {
      searchTerm: "",
    },
  });

  const history = useHistory();

  const { data, loading } = useQuery<
    RestaurantsQueryQuery,
    RestaurantsQueryQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: page,
        pageSize: 3,
      },
    },
  });

  const categories = data?.allCategories?.categories;
  const results = data?.allRestaurants?.results;

  const movePage = (index: 1 | -1) => {
    setPage((current) => current + index);
  };

  const onSubmit = () => {
    console.log("onSubmit");
    const { searchTerm } = getValues();

    history.push({
      pathname: RouterPath.SEARCH,
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 w-full py-10 flex items-center justify-center"
      >
        <input
          type="text"
          className="input border-0 w-3/4 md:w-3/12"
          placeholder="레스토랑 검색"
          {...register("searchTerm", { required: true })}
        ></input>
      </form>
      {!loading && (
        <div className="container mx-auto">
          <div className="flex justify-around max-w-xl mx-auto">
            {categories?.map((category) => {
              const fixCategory = category as CategoryPartsFragment;

              return (
                <Link to={`/category/${fixCategory.slug}`} key={fixCategory.id}>
                  <div
                    key={fixCategory.id}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full group-hover:bg-green-400 flex items-center justify-center">
                      <div
                        className="w-14 h-14 bg-cover rounded-full"
                        style={{
                          backgroundImage: `url(${fixCategory.coverImage})`,
                        }}
                      ></div>
                    </div>
                    <span className="mt-1 text-sm text-center font-medium">
                      {fixCategory.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10">
            {results?.map((restaurant, index) => {
              const fixRestaurant = restaurant as RestaurantPartsFragment;

              return (
                <Restaurant
                  key={String(index)}
                  restaurant={{
                    id: fixRestaurant.id,
                    name: fixRestaurant.name,
                    coverImage: fixRestaurant.coverImage,
                    category: fixRestaurant.category,
                  }}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-3 justify-center mt-10 items-center max-w-xl mx-auto">
            {page > 1 ? (
              <button
                onClick={() => movePage(-1)}
                className="focus:outline-none font-medium text-3xl"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="text-center">
              현재 페이지 {page} / {data?.allRestaurants?.totalPages}
            </span>

            {page < (data?.allRestaurants?.totalPages ?? 1) ? (
              <button
                onClick={() => movePage(1)}
                className="focus:outline-none font-medium text-3xl"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
