import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImage
    category {
      name
    }
    address
    isPromoted
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImage
    slug
    restaurantCount
  }
`;

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    createdAt
    updatedAt
    name
    price
    photo
    description
    options {
      name
      choices {
        name
        extra
      }
      extra
    }
  }
`;

export const ORDER_FRAGMENT = gql`
  fragment OrderParts on Order {
    id
    total
    createdAt
    status
  }
`;
