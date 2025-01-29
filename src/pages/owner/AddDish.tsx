import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";
import { MY_RESTAURANT_QUERY } from "./MyRestaurant";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";
import { useState } from "react";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

const OPTION_NAME_PREFIX = "optionName-";
const OPTION_EXTRA_PREFIX = "optionExtra-";

const CHOICE_NAME_PREFIX = "choiceName-";
const CHOICE_EXTRA_PREFIX = "choiceExtra-";

type IForm = {
  name: string;
  price: number;
  description: string;
} & Record<string, string>;

const AddDish = () => {
  const param = useParams<{ restaurantId: string }>();

  const [optionInputs, setOptionInputs] = useState<number[]>([]);
  const [choiceInputs, setChoiceInputs] = useState<{ [key: string]: number[] }>(
    {}
  );

  const history = useHistory();

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
    onCompleted: (data) => {
      const { ok, error } = data.createDish;
      if (ok) {
        console.log("메뉴 생성 완료");
        history.push(`/restaurant/${param.restaurantId}`);
      } else {
        console.log("메뉴 생성 실패", error);
      }
    },
  });

  const {
    formState: { errors, isValid },
    register,
    getValues,
    handleSubmit,
    setValue,
    unregister,
  } = useForm<IForm>({
    mode: "onChange",
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    console.log(rest);

    const options = optionInputs.map((id) => {
      const extra = rest[`${OPTION_EXTRA_PREFIX}${id}`];

      const choices = choiceInputs[`${id}`]?.map((choiceId) => {
        const choiceExtra = rest[`${CHOICE_EXTRA_PREFIX}${choiceId}`];
        return {
          name: rest[`${CHOICE_NAME_PREFIX}${choiceId}`],
          extra: choiceExtra ? +choiceExtra : 0,
        };
      });

      return {
        name: rest[`${OPTION_NAME_PREFIX}${id}`],
        extra: extra ? +extra : 0,
        choices,
      };
    });

    createDish({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +param.restaurantId,
          options,
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
            <div>
              <button
                type="button"
                className="button"
                onClick={() => {
                  setOptionInputs((prev) => [Date.now(), ...prev]);
                }}
              >
                옵션 추가
              </button>
            </div>
            {optionInputs.map((optionId) => (
              <div>
                <div key={optionId} className="flex grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="옵션 이름"
                    className="input"
                    {...register(`${OPTION_NAME_PREFIX}${optionId}`)}
                  ></input>
                  <input
                    type="number"
                    min={0}
                    placeholder="옵션 가격"
                    className="input"
                    {...register(`${OPTION_EXTRA_PREFIX}${optionId}`, {
                      valueAsNumber: true,
                    })}
                  ></input>
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      const choiceId = Date.now();
                      setChoiceInputs((prev) => ({
                        ...prev,
                        [`${optionId}`]: [
                          choiceId,
                          ...(prev[`${optionId}`] || []),
                        ],
                      }));
                    }}
                  >
                    하위 옵션 추가
                  </button>
                  <button
                    type="button"
                    className="button bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setOptionInputs((prev) =>
                        prev.filter((rowId) => rowId !== optionId)
                      );
                      unregister(`${OPTION_NAME_PREFIX}${optionId}`);
                      unregister(`${OPTION_EXTRA_PREFIX}${optionId}`);
                    }}
                  >
                    삭제
                  </button>
                </div>
                <div>
                  {choiceInputs[`${optionId}`]?.map((choiceId) => (
                    <div key={choiceId} className="flex grid-cols-3 mt-2 gap-3">
                      <input
                        type="text"
                        placeholder="하위 옵션 이름"
                        className="input ml-10"
                        {...register(`${CHOICE_NAME_PREFIX}${choiceId}`)}
                      ></input>
                      <input
                        type="text"
                        placeholder="하위 옵션 가격"
                        className="input"
                        {...register(`${CHOICE_EXTRA_PREFIX}${choiceId}`)}
                      ></input>
                      <button
                        type="button"
                        className="button bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          setChoiceInputs((prev) => ({
                            ...prev,
                            [`${optionId}`]: prev[`${optionId}`].filter(
                              (rowId) => rowId !== choiceId
                            ),
                          }));
                          unregister(`${choiceId}`);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
