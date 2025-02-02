import { gql, useMutation, useSubscription } from "@apollo/client";

import React, { useEffect, useRef, useState } from "react";
import { FULL_ORDER_FRAGMENT } from "../../fragment";
import {
  CookedOrdersSubscription,
  CookedOrdersSubscriptionVariables,
  FullOrderPartsFragment,
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../__generated__/graphql";
import { renderToStaticMarkup } from "react-dom/server";
import { Link, useHistory } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";

const SUB_COOKED_ORDER = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

const mapId = "map";

const DeliveryBoard = () => {
  const { data: subscriptionData } = useSubscription<
    CookedOrdersSubscription,
    CookedOrdersSubscriptionVariables
  >(SUB_COOKED_ORDER);

  const history = useHistory();

  const cookedOrders = subscriptionData?.cookedOrders as FullOrderPartsFragment;

  const [takeOrder, { data: takeOrderData }] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, {
    onCompleted: (data) => {
      if (data.takeOrder.ok) {
        history.push(`${RouterPath.ORDER}/${cookedOrders?.id}`);
      }
    },
  });

  const [map, setMap] = useState<naver.maps.Map>();

  // 기사님 실시간 위치, watchPosition에 의해 계속 랜더링 되므로 주의
  const [realTimeMyLocation, setRealTimeMyLocation] = useState<
    naver.maps.LatLng | undefined | null
  >(null);

  // 주문관련 마커 초기 기사위치, 레스토랑 위치, 배달 위치 마커들
  const refOrderMarkers = useRef<naver.maps.Marker[]>([]);

  // polyline을 담을 배열
  const refPolyLine = useRef<naver.maps.Polyline[]>([]);

  /** 지도 생성 훅 */
  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 14,
    };

    const initMap = new naver.maps.Map(mapId, mapOptions);
    setMap(initMap);
  }, []);

  /** 센터 변경 */
  useEffect(() => {
    if (map && realTimeMyLocation) {
      map.setCenter(realTimeMyLocation);
    }
  }, [map, realTimeMyLocation]);

  /** 내 위치 window 이벤트 훅 */
  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const myLocation = new naver.maps.LatLng(lat, lng);
        setRealTimeMyLocation((prev) => {
          if (prev?.lat !== myLocation.lat || prev?.lng !== myLocation.lng) {
            return myLocation;
          }
          return prev;
        });
      },
      (error) => {},
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  const createPolyline = (
    path:
      | naver.maps.ArrayOfCoords
      | naver.maps.KVOArrayOfCoords
      | naver.maps.ArrayOfCoordsLiteral
  ): naver.maps.Polyline => {
    const polylineOptions: Pick<
      naver.maps.PolygonOptions,
      | "fillColor"
      | "fillOpacity"
      | "strokeColor"
      | "strokeOpacity"
      | "strokeWeight"
    > & { endIcon: naver.maps.PointingIcon } = {
      fillColor: "#E16E79",
      fillOpacity: 0.3,
      strokeColor: "#E16E79",
      strokeOpacity: 1,
      strokeWeight: 3,
      endIcon: naver.maps.PointingIcon.BLOCK_ARROW,
    };

    const polyLine = new naver.maps.Polyline({
      path: path,
      ...polylineOptions,
    });

    return polyLine;
  };

  const drawOrderPath = async (params: {
    // 레스토랑 위치
    restaurantLatLng: naver.maps.LatLng;
    // 배달 위치
    orderLatLng: naver.maps.LatLng;
    // 기사 위치
    driverLatLng: naver.maps.LatLng;
    map: naver.maps.Map;
  }) => {
    // 기사 => 레스토랑
    drawPolyLines({
      origin: params.driverLatLng,
      destination: params.restaurantLatLng,
      map: params.map,
    });

    // 레스토랑 => 배달 위치
    drawPolyLines({
      origin: params.restaurantLatLng,
      destination: params.orderLatLng,
      map: params.map,
    });

    const restaurantIcon = renderToStaticMarkup(
      <div
        style={{
          backgroundColor: "green",
          borderRadius: "999px",
          padding: "10px",
          fontSize: "10px",
        }}
      >
        레스토랑
      </div>
    );

    const orderIcon = renderToStaticMarkup(
      <div
        style={{
          backgroundColor: "blue",
          borderRadius: "999px",
          padding: "10px",
          fontSize: "10px",
        }}
      >
        도착지
      </div>
    );

    // 레스토랑 마커
    const restaurantMarker = new naver.maps.Marker({
      position: params.restaurantLatLng,
      map: params.map,
      icon: {
        content: restaurantIcon,
      },
    });

    // 주문 마커
    const orderMarker = new naver.maps.Marker({
      position: params.orderLatLng,
      map: params.map,
      icon: {
        content: orderIcon,
      },
    });

    // 기사 마커
    const driverMarker = new naver.maps.Marker({
      position: params.driverLatLng,
      map: params.map,
    });

    refOrderMarkers.current.push(restaurantMarker);
    refOrderMarkers.current.push(orderMarker);
    refOrderMarkers.current.push(driverMarker);
  };

  const drawPolyLines = async (params: {
    // 출발지
    origin: naver.maps.LatLng;
    // 도착지
    destination: naver.maps.LatLng;
    map: naver.maps.Map;
  }) => {
    // removePolyLines();
    // https://naveropenapi.apigw.ntruss.com
    // const baseUrl =
    //   "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";
    const baseUrl = `${process.env.REACT_APP_API_DOMAIN}/map-direction/v1/driving`;

    const reqParams = {
      start: `${params.origin.lng()},${params.origin.lat()}`,
      goal: `${params.destination.lng()},${params.destination.lat()}`,
    };

    const queryString = new URLSearchParams(reqParams).toString(); // url에 쓰기 적합한 querySting으로 return 해준다.
    const requrl = `${baseUrl}?${queryString}`; // 완성된 요청 url.

    try {
      const response = await fetch(requrl);
      const data = (await response.json()) as {
        code: number;
        currentDateTime: Date;
        message: string;
        route?: {
          traoptimal?: {
            path?: [number, number][];
          }[];
        };
      };

      const path = data.route?.traoptimal?.[0]?.path;
      if (path) {
        const polyLine = createPolyline(path);
        polyLine.setMap(params.map);
        refPolyLine.current?.push(polyLine);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  /** 주문에 대한 기사, 레스토랑, 배달위치 */
  useEffect(() => {
    const orderId = cookedOrders?.id;

    if (map && cookedOrders && orderId && realTimeMyLocation) {
      // 주문이 있으면
      const restaurantLatLng = new naver.maps.LatLng(
        cookedOrders.restaurant?.lat!,
        cookedOrders?.restaurant?.lng!
      ); // 레스토랑 위치
      const orderLatLng = new naver.maps.LatLng(
        cookedOrders.lat,
        cookedOrders.lng
      ); // 배달 위치

      //const fakeMyLocation = new naver.maps.LatLng(37.5595704, 127.305399); // 기사 위치

      drawOrderPath({
        restaurantLatLng: restaurantLatLng,
        orderLatLng: orderLatLng,
        //driverLatLng: fakeMyLocation,
        driverLatLng: realTimeMyLocation,
        map: map,
      });
    }

    return () => {
      // 경로선 제거
      if (refPolyLine.current.length > 0) {
        for (const polyLine of refPolyLine.current) {
          polyLine.setMap(null);
        }
        refPolyLine.current = [];
      }

      // 마커들 제거
      if (refOrderMarkers.current.length > 0) {
        for (const marker of refOrderMarkers.current) {
          marker.setMap(null);
        }
        refOrderMarkers.current = [];
      }
    };
  }, [map, cookedOrders, realTimeMyLocation]);

  const onClickTakeOrder = () => {
    takeOrder({
      variables: {
        input: {
          id: cookedOrders?.id!,
        },
      },
    });
  };

  return (
    <div>
      <div id={mapId} style={{ width: "100%", height: "50vh" }}></div>
      {cookedOrders?.id && (
        <div className="container relative">
          <div className="flex flex-col  justify-center items-center relative -top-6 bg-orange-500 p-12 gap-5">
            <h4>주문이 들어왔습니다. 수락하시겠습니까?</h4>
            <button
              className="button w-full text-center"
              onClick={onClickTakeOrder}
            >
              도전
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoard;
