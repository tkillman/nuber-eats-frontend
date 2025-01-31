import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
} from "../__generated__/graphql";

const GET_ORDERS_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

const OrderComponent = () => {
  const param = useParams<{ id: string }>();
  const { data } = useQuery<GetOrderQuery, GetOrderQueryVariables>(
    GET_ORDERS_QUERY,
    {
      variables: {
        input: {
          orderId: +param.id,
        },
      },
    }
  );

  console.log(data);

  return (
    <div>
      <h1>Order</h1>
      <p>Order page content</p>
    </div>
  );
};

export default OrderComponent;
