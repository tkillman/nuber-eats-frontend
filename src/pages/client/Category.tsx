import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  FindCategoryQuery,
  FindCategoryQueryVariables,
} from "../../__generated__/graphql";

const FIND_CATEGORY = gql`
  query findCategory($input: FindCategoryInput!) {
    findCategory(input: $input) {
      ok
      error
      totalPages
      totalResults
      category {
        ...CategoryParts
        restaurants {
          ...RestaurantParts
        }
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

type CategoryParams = {
  slug: string;
};

const Category = () => {
  const param = useParams<CategoryParams>();
  console.log("🚀 ~ file: Category.tsx ~ line 3 ~ Category ~ param", param);

  const { slug } = param;

  const { data } = useQuery<FindCategoryQuery, FindCategoryQueryVariables>(
    FIND_CATEGORY,
    {
      variables: {
        input: {
          page: 1,
          slug,
        },
      },
    }
  );

  console.log("data", data);

  return <div>cate</div>;
};

export default Category;
