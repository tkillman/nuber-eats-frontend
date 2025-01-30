import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import {
  DISH_FRAGMENT,
  ORDER_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragment";
import {
  DishPartsFragment,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  OrderPartsFragment,
  RestaurantPartsFragment,
} from "../../__generated__/graphql";
import { RouterPath } from "../../routes/routerPath";
import Dish from "../../components/Dish";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { useState } from "react";
import EditDish from "./editDish";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

const chartData = [
  { x: 1, y: 3000 },
  { x: 2, y: 1500 },
  { x: 3, y: 4250 },
  { x: 4, y: 1250 },
  { x: 5, y: 2300 },
  { x: 6, y: 7150 },
  { x: 7, y: 6830 },
  { x: 8, y: 6830 },
  { x: 9, y: 6830 },
  { x: 10, y: 6830 },
  { x: 11, y: 6830 },
];

const MyRestaurant = () => {
  const param = useParams<{ id: string }>();

  const [editDish, setEditDish] = useState<DishPartsFragment | null>(null);
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

  const restaurant = data?.myRestaurant
    .restaurant as RestaurantPartsFragment & {
    menu?: DishPartsFragment[];
    orders?: OrderPartsFragment[];
  };

  const dishes = restaurant?.menu;
  const orders = restaurant?.orders;

  const moveBack = () => {
    setEditDish(null);
  };

  return (
    <div>
      <div
        className="bg-cover bg-center min-h-28 mt-2"
        style={{ backgroundImage: `url(${restaurant?.coverImage})` }}
      ></div>
      {!editDish && (
        <div className="container">
          <h4 className="mt-2">My Restaurant</h4>
          <div className="flex gap-2 mt-2">
            <Link to={`${RouterPath.ADD_DISH}/${param.id}`}>
              <h3 className="button bg-slate-600 hover:bg-slate-700">
                메뉴 추가 &rarr;
              </h3>
            </Link>
            <h3 className="button">프로모션 지불하기 &rarr;</h3>
          </div>
          {dishes && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              {dishes.map((dish) => {
                return (
                  <div
                    key={dish.id}
                    onClick={() => {
                      setEditDish(dish);
                    }}
                  >
                    <Dish dish={dish} />
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-5">
            <h4 className="font-bold text-center">판매 그래프</h4>
            <div className="max-w-lg mx-auto">
              {/* <VictoryChart domainPadding={20}>
              <VictoryAxis
                //label="Amount of Money"
                dependentAxis
                tickFormat={(tick) => `${tick}원`}
                //tickValues={[20, 30, 40, 50, 60]}
              />
              <VictoryAxis label="Days" />
              <VictoryBar data={chartData} />
            </VictoryChart> */}
              <VictoryChart
                height={500}
                theme={VictoryTheme.material}
                width={window.innerWidth}
                domainPadding={50}
                containerComponent={<VictoryVoronoiContainer />}
              >
                <VictoryLine
                  labels={({ datum }) => `$${datum.y}`}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSize: 18 }}
                      renderInPortal
                      dy={-20}
                    />
                  }
                  data={orders?.map((order) => ({
                    x: order.createdAt,
                    y: order.total,
                  }))}
                  interpolation="natural"
                  style={{
                    data: {
                      strokeWidth: 5,
                    },
                  }}
                />
                <VictoryAxis
                  tickLabelComponent={<VictoryLabel renderInPortal />}
                  style={{
                    tickLabels: {
                      fontSize: 20,
                    },
                  }}
                  tickFormat={(tick: any) =>
                    new Date(tick).toLocaleDateString("ko")
                  }
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      )}
      {!!editDish && <EditDish dish={editDish} moveBack={moveBack} />}
    </div>
  );
};

export default MyRestaurant;
