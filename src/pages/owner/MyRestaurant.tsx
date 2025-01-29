import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragment";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const MyRestaurant = () => {
  const param = useParams<{ id: string }>();
  console.log(param.id);

  const { data } = useQuery(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +param.id,
      },
    },
  });
  console.log(data);
  return <div>My Restaurant</div>;
};

export default MyRestaurant;
