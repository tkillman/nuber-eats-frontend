import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";
import { MY_RESTAURANT_QUERY } from "./MyRestaurant";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

type IForm = {
  name: string;
  price: number;
  description: string;
};

const AddDish = () => {
  const param = useParams<{ restaurantId: string }>();

  const [createDish, { data, loading: creatingDish }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            restaurantId: +param.restaurantId,
          },
        },
      },
    ],
  });

  const {
    formState: { errors, isValid },
    register,
    getValues,
    handleSubmit,
  } = useForm<IForm>({
    mode: "onChange",
  });

  console.log(param.restaurantId);

  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDish({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +param.restaurantId,
        },
      },
    });
  };

  return (
    <div>
      <div className="container">
        <h4>Add Dish</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="메뉴 이름"
              className="input"
              {...register("name", {
                required: "메뉴 이름은 필수입니다.",
              })}
            ></input>
            <FormError errorMessage={errors.name?.message} />
            <input
              type="number"
              min={0}
              placeholder="메뉴 가격"
              className="input"
              {...register("price", {
                required: "메뉴 가격은 필수입니다.",
              })}
            ></input>
            <FormError errorMessage={errors.price?.message} />

            <input
              type="text"
              placeholder="설명"
              className="input"
              {...register("description", {
                required: "설명은 필수입니다.",
              })}
            ></input>
            <FormError errorMessage={errors.description?.message} />

            <FormButton
              isValid={isValid}
              loading={creatingDish}
              text="메뉴 생성"
            ></FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDish;
