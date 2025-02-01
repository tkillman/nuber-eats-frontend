import { gql, useSubscription } from "@apollo/client";

import { useEffect, useRef, useState } from "react";
import { FULL_ORDER_FRAGMENT } from "../../fragment";
import {
  CookedOrdersSubscription,
  CookedOrdersSubscriptionVariables,
  FullOrderPartsFragment,
} from "../../__generated__/graphql";

const SUB_COOKED_ORDER = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const mapId = "map";

const DeliveryBoard = () => {
  const { data: subscriptionData } = useSubscription<
    CookedOrdersSubscription,
    CookedOrdersSubscriptionVariables
  >(SUB_COOKED_ORDER);

  const [map, setMap] = useState<naver.maps.Map>();
  const [myLocation, setMyLocation] = useState<naver.maps.LatLng>();

  /** 지도 생성 훅 */
  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 14,
    };

    const initMap = new naver.maps.Map(mapId, mapOptions);
    setMap(initMap);
  }, []);

  /** 내 위치 좌표 훅*/
  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const lat = position.coords.latitude;
    //   const lng = position.coords.longitude;
    //   console.log("my location", lat, lng);
    //   const myLocation = new naver.maps.LatLng(lat, lng);
    //   setMyLocation(myLocation);
    // });

    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const myLocation = new naver.maps.LatLng(lat, lng);
        setMyLocation(myLocation);
      },
      (error) => {},
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  /** 내 위치 마커표시 훅 */
  useEffect(() => {
    let marker: naver.maps.Marker | null = null;

    if (map && myLocation) {
      map.setCenter(myLocation);
      marker = new naver.maps.Marker({
        position: myLocation,
        map: map,
      });
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [map, myLocation]);

  const drawPath = async (
    origin: naver.maps.LatLng,
    destination: naver.maps.LatLng
  ) => {
    const baseUrl = "https://naveropenapi.apigw.ntruss.com/map-direction/v1";
    const params = {
      start: "127.12345,37.12345",
      goal: "123.45678,34.56789:124.56789,35.67890",
    };

    const queryString = new URLSearchParams(params).toString(); // url에 쓰기 적합한 querySting으로 return 해준다.
    const requrl = `${baseUrl}?${queryString}`; // 완성된 요청 url.

    try {
      const response = await fetch(requrl, {
        headers: {
          "x-ncp-apigw-api-key-id": "kdcml5umif",
          "x-ncp-apigw-api-key": "tv94fYV8Ce33yKHYCGvlRsiq2kixVUbqt8TqGiWI",
        },
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  /** 출발지와 도착지에 대한 경로선 훅 */
  useEffect(() => {
    if (map) {
      const origin = new naver.maps.LatLng(37.322752, 127.0939648);
      const destination = new naver.maps.LatLng(37.3595704, 127.105399);

      drawPath(origin, destination);
    }
  }, [map]);

  return (
    <div>
      <div id={mapId} style={{ width: "100%", height: "50vh" }}></div>
    </div>
  );
};

export default DeliveryBoard;
