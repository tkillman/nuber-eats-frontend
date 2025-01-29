import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  RestaurantPartsFragment,
} from "../../__generated__/graphql";
import { RouterPath } from "../../routes/routerPath";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
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

const MyRestaurant = () => {
  const param = useParams<{ id: string }>();
  console.log(param.id);

  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +param.id,
        },
      },
    }
  );

  const restaurant = data?.myRestaurant.restaurant as RestaurantPartsFragment;
  console.log(restaurant);
  return (
    <div>
      <div
        className="bg-cover bg-center min-h-28 mt-2"
        style={{ backgroundImage: `url(${restaurant?.coverImage})` }}
      ></div>
      <div className="container">
        <h4 className="mt-2">My Restaurant</h4>
        <div className="flex gap-2 mt-2">
          <Link to={`${RouterPath.ADD_DISH}/${param.id}`}>
            <h3 className="button bg-slate-600 hover:bg-slate-700">
              메뉴 추가 &rarr;
            </h3>
          </Link>
          <Link to={"/asdfkj"}>
            <h3 className="button">프로모션 지불하기 &rarr;</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
