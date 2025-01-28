import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
  MyRestaurantsQuery,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";
import { useState } from "react";
import { MY_RESTAURANTS_QUERY } from "./MyRestaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInputType!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

type IForm = {
  name: string;
  address: string;
  categoryName: string;
  file?: FileList;
  coverImage?: string;
};

const defaultFormValues: IForm = {
  name: "",
  address: "",
  categoryName: "",
};

const AddRestaurant = () => {
  const [loading, setLoading] = useState(false);

  const client = useApolloClient();

  const onCompleted = (data: CreateRestaurantMutation) => {
    if (data.createRestaurant.ok) {
      console.log("레스토랑 생성 성공");
      const { name, address, categoryName, coverImage = "" } = getValues();

      const queryResult = client.readQuery<MyRestaurantsQuery>({
        query: MY_RESTAURANTS_QUERY,
      });

      client.writeQuery<MyRestaurantsQuery>({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult!.myRestaurants,
            restaurants: [
              {
                id: data.createRestaurant.restaurantId!,
                name,
                coverImage,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                address,
                isPromoted: false,
                __typename: "Restaurant",
              },
              ...queryResult!.myRestaurants.restaurants!,
            ],
          },
        },
      });
      setLoading(false);
    } else {
      console.log(data.createRestaurant.error);
    }
  };

  const [createRestaurant, { data, loading: createingRestaurant }] =
    useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(
      CREATE_RESTAURANT_MUTATION,
      {
        // 이렇게 리패치 해도 되지만, 캐시를 업데이트 하는 방법이 있음
        //refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
        onCompleted: onCompleted,
      }
    );

  const {
    handleSubmit,
    getValues,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<IForm>({
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const onSubmit = async () => {
    const { name, address, categoryName, file } = getValues();
    console.log(name, address, categoryName);
    const formData = new FormData();
    formData.append("file", file![0]);
    try {
      setLoading(true);

      const { url: coverImage } = (await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formData,
        })
      ).json()) as { url: string };

      setValue("coverImage", coverImage);
      createRestaurant({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h4>Add Restaurant</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="레스토랑 이름"
            className="input"
            {...register("name", {
              required: "레스토랑 이름은 필수입니다.",
            })}
          ></input>
          <FormError errorMessage={errors.name?.message} />
          <input
            type="text"
            placeholder="레스토랑 주소"
            className="input"
            {...register("address", {
              required: "레스토랑 주소는 필수입니다.",
            })}
          ></input>
          <FormError errorMessage={errors.address?.message} />

          <input
            type="text"
            placeholder="카테고리 이름"
            className="input"
            {...register("categoryName", {
              required: "카테고리이름은 필수입니다.",
            })}
          ></input>
          <FormError errorMessage={errors.categoryName?.message} />
          <input
            type="file"
            accept="image/*"
            {...register("file", {
              required: "파일은 필수입니다.",
            })}
          ></input>
          <FormButton
            isValid={isValid}
            loading={loading}
            text="레스토랑 생성"
          ></FormButton>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
