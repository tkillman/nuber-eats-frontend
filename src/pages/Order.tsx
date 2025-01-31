import { gql, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  FullOrderPartsFragment,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
} from "../__generated__/graphql";
import { FULL_ORDER_FRAGMENT } from "../fragment";
import { useEffect } from "react";

const GET_ORDERS_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const SUB_ORDER_UPDATES = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const OrderComponent = () => {
  const params = useParams<{ id: string }>();
  const { data, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDERS_QUERY, {
    variables: {
      input: {
        orderId: +params.id,
      },
    },
  });

  // const { data: subscriptionData } = useSubscription<
  //   OrderUpdatesSubscription,
  //   OrderUpdatesSubscriptionVariables
  // >(SUB_ORDER_UPDATES, {
  //   variables: {
  //     input: {
  //       id: +param.id,
  //     },
  //   },
  // });

  const order = data?.getOrder?.order as
    | FullOrderPartsFragment
    | undefined
    | null;

  console.log(order);

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: SUB_ORDER_UPDATES,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev;
          const newOrder = data.orderUpdates as FullOrderPartsFragment;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...newOrder,
              },
            },
          };
        },
      });
    }
  }, [data]);

  return (
    <div>
      <div className="container mt-10">
        <h1>Order</h1>
        <div className="grid grid-cols-2 gap-2">
          <div>주문 레스토랑</div>
          <div>{order?.restaurant?.name}</div>
          <div>주문금액</div>
          <div>{order?.total}원</div>
          <div>주문상태</div>
          <div>{order?.status}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
