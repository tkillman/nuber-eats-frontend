import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  FullOrderPartsFragment,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
  UserRole,
} from "../__generated__/graphql";
import { FULL_ORDER_FRAGMENT } from "../fragment";
import { useEffect } from "react";
import { useMe } from "../hooks/useMe";

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

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
  const { data: userMe } = useMe();

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

  const [editOrder, { loading: editingOrder }] = useMutation(
    EDIT_ORDER_MUTATION,
    {
      onCompleted: () => {},
    }
  );

  const getEditOrderButtonText = () => {
    if (userMe?.me.role === UserRole.Owner) {
      if (order?.status === OrderStatus.Pending) {
        return "Accept Order";
      } else if (order?.status === OrderStatus.Cooking) {
        return "Order Cooked";
      }
    } else if (userMe?.me.role === UserRole.Delivery) {
      if (order?.status === OrderStatus.Cooked) {
        return "Picked Up";
      } else if (order?.status === OrderStatus.PickUp) {
        return "Delivered";
      }
    }

    return "";
  };

  const onClickEditOrder = () => {
    let nextOrderStatus: OrderStatus | null = null;

    if (userMe?.me.role === UserRole.Owner) {
      if (order?.status === OrderStatus.Pending) {
        nextOrderStatus = OrderStatus.Cooking;
      } else if (order?.status === OrderStatus.Cooking) {
        nextOrderStatus = OrderStatus.Cooked;
      }
    } else if (userMe?.me.role === UserRole.Delivery) {
      if (order?.status === OrderStatus.Cooked) {
        nextOrderStatus = OrderStatus.PickUp;
      } else if (order?.status === OrderStatus.PickUp) {
        nextOrderStatus = OrderStatus.Delivered;
      }
    }

    if (nextOrderStatus) {
      editOrder({
        variables: {
          input: {
            id: +params.id,
            status: nextOrderStatus,
          },
        },
      });
    }
  };

  const editOrderButtonText = getEditOrderButtonText();

  return (
    <div>
      <div className="container mt-10">
        <h1 className="text-center mb-3">Order</h1>
        <div className="grid grid-cols-2 gap-2 bg-green-300 p-3 mb-5">
          <div className="text-center border-b-2 border-red-300">
            주문 레스토랑
          </div>
          <div className="border-b-2 border-red-300 text-end">
            {order?.restaurant?.name}
          </div>
          <div className="text-center border-b-2 border-red-300">주문금액</div>
          <div className="border-b-2 border-red-300 text-end">
            {order?.total}원
          </div>
          <div className="text-center border-b-2 border-red-300">배달주소</div>
          <div className="border-b-2 border-red-300 text-end">
            {order?.address}
          </div>
          <div className="text-center border-b-2 border-red-300">주문상태</div>
          <div className="border-b-2 border-red-300 text-end">
            {order?.status}
          </div>
        </div>
        {order?.status === OrderStatus.Delivered && (
          <div>
            <h4>주문 배달이 완료됐습니다.</h4>
            <h4>이용해주셔서 감사합니다.</h4>
          </div>
        )}
        <div className="flex justify-center items-center">
          {!!editOrderButtonText && (
            <button type="button" className="button" onClick={onClickEditOrder}>
              {editOrderButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
