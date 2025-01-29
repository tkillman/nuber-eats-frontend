import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

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

  const [createDish, { data, loading: creatingDish }] =
    useMutation(CREATE_DISH_MUTATION);

  const { formState, register, getValues } = useForm<IForm>();

  console.log(param.restaurantId);

  return (
    <div>
      <div className="container">
        <h4>Add Dish</h4>
      </div>
    </div>
  );
};

export default AddDish;
