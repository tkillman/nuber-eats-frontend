import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  CreateOrderInput,
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  DishPartsFragment,
  RestaurantPartsFragment,
  RestaurantQueryQuery,
  RestaurantQueryQueryVariables,
} from "../../__generated__/graphql";
import Dish, {
  CreateOrderItemInputWithExtra,
  OnChangeItem,
} from "../../components/Dish";
import { useState } from "react";
import Modal from "../../components/Modal";
import FormButton from "../../components/FormButton";
import { RouterPath } from "../../routes/routerPath";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      order {
        id
      }
    }
  }
`;

const RESTARAUNT_QUERY = gql`
  query restaurantQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
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

type RestaurantsDetailParams = {
  id: string;
};

const RestaurantsDetail = () => {
  const param = useParams<RestaurantsDetailParams>();

  const [isOrderStarted, setIsOrderStarted] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [orderAddress, setOrderAddress] = useState("");

  const history = useHistory();

  const [createOrder, { data: createOrderData, loading: creaingOrder }] =
    useMutation<CreateOrderMutation, CreateOrderMutationVariables>(
      CREATE_ORDER_MUTATION,
      {
        onCompleted: (data) => {
          if (data.createOrder.ok) {
            alert("주문이 완료되었습니다.");
            setIsOrderStarted(false);
            setSelectedItems([]);
            history.push(`${RouterPath.ORDER}/${data.createOrder.order?.id}`);
          } else {
            alert(
              data.createOrder.error
                ? data.createOrder.error
                : "주문을 완료할 수 없습니다."
            );
          }

          setIsAddressModalOpen(false);
        },
      }
    );

  const [selectedItems, setSelectedItems] = useState<
    CreateOrderItemInputWithExtra[]
  >([]);

  const { data } = useQuery<
    RestaurantQueryQuery,
    RestaurantQueryQueryVariables
  >(RESTARAUNT_QUERY, {
    variables: {
      input: {
        restaurantId: +param.id,
      },
    },
  });

  const restaurant = data?.restaurant.restaurant as
    | (RestaurantPartsFragment & {
        menu?: DishPartsFragment[];
      })
    | undefined;

  const dishes = restaurant?.menu;
  console.log("🚀 ~ RestaurantsDetail ~ restaurant:", restaurant);

  const onChangeItem: OnChangeItem = (item) => {
    setSelectedItems((prev) => {
      const foundItem = prev.find((aItem) => aItem.dishId === item.dishId);
      if (foundItem) {
        return prev.map((aItem) =>
          aItem.dishId === item.dishId
            ? { ...aItem, options: item.options }
            : aItem
        );
      }
      return [item, ...prev];
    });
  };

  const onRemoveItem = (dishId: number) => {
    setSelectedItems((prev) => prev.filter((aItem) => aItem.dishId !== dishId));
  };

  const onSubmitCreateOrder = () => {
    const items: Array<CreateOrderItemInput> = selectedItems.map((row) => {
      return {
        dishId: row.dishId,
        options: row.options?.map((option) => {
          return {
            name: option.name,
            choice: option.choice,
          };
        }),
      };
    });

    createOrder({
      variables: {
        input: {
          restaurantId: +param.id,
          items,
          orderAddress: orderAddress,
        },
      },
    });
  };

  return (
    <div>
      <div
        className="bg-red-500 bg-center bg-cover py-16"
        style={{
          backgroundImage: `url(${restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white py-4 inline-block">
          <h4 className="text-4xl mb-3 whitespace-nowrap">
            {restaurant?.name}
          </h4>
          <h5 className="text-sm font-light">{restaurant?.category?.name}</h5>
          <h6>{restaurant?.address}</h6>
        </div>
      </div>
      <div className="container py-24">
        <Modal
          isOpen={isAddressModalOpen}
          title="주소를 입력해주세요."
          onClose={() => {
            setIsAddressModalOpen(false);
          }}
        >
          <div>
            <div className="flex mt-5">
              <input
                type="text"
                className="input w-full"
                placeholder="주소 입력"
                value={orderAddress}
                onChange={(e) => {
                  setOrderAddress(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSubmitCreateOrder();
                  }
                }}
              ></input>
            </div>
            <div>
              <button
                disabled={!orderAddress}
                className={`w-full py-2 mt-4  text-white rounded-lg ${
                  orderAddress
                    ? "bg-gray-800"
                    : "bg-gray-300 pointer-events-none"
                }`}
                onClick={onSubmitCreateOrder}
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
        <h4>메뉴</h4>
        <div>
          {dishes && (
            <div className="flex justify-between relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 w-full">
                {dishes.map((dish) => {
                  return (
                    <Dish
                      key={dish.id}
                      dish={dish}
                      isCheckMode={isOrderStarted}
                      onChangeItem={onChangeItem}
                      onRemoveItem={onRemoveItem}
                    />
                  );
                })}
              </div>
              <div className="fixed bottom-4 right-4 md:static min-w-32 md:px-10">
                <div className="flex justify-end">
                  {!isOrderStarted && (
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        setIsOrderStarted(true);
                      }}
                    >
                      주문하기
                    </button>
                  )}
                  {isOrderStarted && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          if (selectedItems.length === 0) {
                            alert("주문할 메뉴를 선택해주세요.");
                            return;
                          }

                          const ok = window.confirm("주문하시겠습니까?");
                          if (ok) {
                            setIsAddressModalOpen(true);
                          } else {
                            setIsOrderStarted(false);
                          }
                        }}
                        disabled={creaingOrder}
                      >
                        주문확정
                      </button>
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          setIsOrderStarted(false);
                        }}
                      >
                        주문취소
                      </button>
                    </div>
                  )}
                </div>
                {selectedItems.length > 0 && (
                  <div className="mt-5 hidden md:block">
                    <div className="flex justify-between">
                      <h4>총액</h4>
                      <h4>
                        {selectedItems.reduce((a, c) => {
                          return (
                            a +
                            c.dishPrice +
                            (c.options?.reduce((a, c) => {
                              return a + c?.choiceExtra;
                            }, 0) ?? 0)
                          );
                        }, 0)}
                        원
                      </h4>
                    </div>
                    <h4>고른 메뉴</h4>
                    {selectedItems.map((item) => {
                      return (
                        <div key={item.dishId}>
                          <div className="flex justify-between">
                            <h4>{item?.dishName}</h4>
                            <h5>{item?.dishPrice}원</h5>
                          </div>
                          <div>
                            {item.options?.map((option) => {
                              return (
                                <div
                                  key={option.name}
                                  className="flex flex-col"
                                >
                                  <h6 className="pl-2">{option.name}</h6>
                                  <div className="flex justify-between">
                                    <h6 className="pl-3">{option.choice}</h6>
                                    <h6 className="pl-3">
                                      {option.choiceExtra}원
                                    </h6>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsDetail;
