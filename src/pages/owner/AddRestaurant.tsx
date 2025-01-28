import { gql, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInputType!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

type IForm = {
  name: string;
  address: string;
  categoryName: string;
};

const defaultFormValues: IForm = {
  name: "",
  address: "",
  categoryName: "",
};

const AddRestaurant = () => {
  const [createRestaurant, { data, loading }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION);

  const {
    handleSubmit,
    getValues,
    register,
    formState: { errors, isValid },
  } = useForm<IForm>({
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const onSubmit = () => {
    const { name, address, categoryName } = getValues();
    console.log(name, address, categoryName);
    // createRestaurant({
    //   variables: {
    //     input: {
    //       name,
    //       address,
    //       categoryName,
    //     },
    //   },
    // });
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
