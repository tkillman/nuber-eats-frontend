import { gql, useQuery, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  MyRestaurantsQuery,
  RestaurantPartsFragment,
} from "../../__generated__/graphql";
import { Link, useHistory } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";
import RestaurantComponent from "../../components/Restaurant";
import { useEffect } from "react";

const SUB_PENDING_ORDERS = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  console.log("🚀 ~ MyRestaurants ~ data:", data);

  const isExist = data?.myRestaurants.restaurants?.length !== 0;
  const results = data?.myRestaurants.restaurants;

  const { data: subscriptionData } = useSubscription(SUB_PENDING_ORDERS);

  const history = useHistory();

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`${RouterPath.ORDER}/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  return (
    <div>
      <div className="container mx-auto">
        <h4 className="mt-14 text-4xl font-bold">MyRestaurants</h4>
        <Link to={RouterPath.ADD_RESTAURANT}>
          <h6 className="text-green-400 underline mt-5 inline-block">
            만드세요 &rarr;
          </h6>
        </Link>
        {!isExist && (
          <div className="flex flex-col gap-10 mt-5">
            <h5>레스토랑이 없습니다.</h5>
          </div>
        )}
        {isExist && (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10">
            {results?.map((restaurant, index) => {
              const fixRestaurant = restaurant as RestaurantPartsFragment;

              return (
                <RestaurantComponent
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
        )}
      </div>
    </div>
  );
};

export default MyRestaurants;
