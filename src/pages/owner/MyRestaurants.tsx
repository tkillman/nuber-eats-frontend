import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { MyRestaurantsQuery } from "../../__generated__/graphql";
import { Link } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";

const MY_RESTAURANTS_QUERY = gql`
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
  return (
    <div>
      <div className="container mx-auto">
        <h4 className="mt-14 text-4xl font-bold">MyRestaurants</h4>
        {data?.myRestaurants.restaurants?.length === 0 && (
          <div className="flex flex-col gap-10 mt-5">
            <h5>레스토랑이 없습니다.</h5>
            <Link to={RouterPath.ADD_RESTAURANT}>
              <h6 className="text-green-400 underline">만드세요 &rarr;</h6>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRestaurants;
