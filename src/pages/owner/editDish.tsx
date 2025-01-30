import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";
import {
  DishPartsFragment,
  EditDishMutation,
  EditDishMutationVariables,
} from "../../__generated__/graphql";
import { FC, useRef, useState } from "react";
import { updateFile } from "../../api/upload.actions";
import { DISH_FRAGMENT } from "../../fragment";

const OPTION_NAME_PREFIX = "optionName-";
const OPTION_EXTRA_PREFIX = "optionExtra-";

const CHOICE_NAME_PREFIX = "choiceName-";
const CHOICE_EXTRA_PREFIX = "choiceExtra-";

const EDIT_DISH_MUTATION = gql`
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
      dish {
        ...DishParts
      }
    }
  }
  ${DISH_FRAGMENT}
`;

interface IEditDish {
  dish: DishPartsFragment;
  moveBack: () => void;
  onSuccessDishUpdate?: () => void;
}

type IForm = {
  name: string;
  price: number;
  description: string;
} & Record<string, any>;

const EditDish: FC<IEditDish> = ({ dish, moveBack }) => {
  const {
    formState: { errors, isValid },
    register,
    getValues,
    handleSubmit,
    setValue,
    unregister,
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      name: dish.name,
      price: dish.price,
      description: dish.description,
    },
  });

  const initChoiceInputs = () => {
    const choiceInputs: { [key: string]: string[] } = {};
    if (dish.options) {
      for (let i = 0; i < dish.options.length; i++) {
        const option = dish.options[i];
        if (option.choices) {
          for (let j = 0; j < option.choices.length; j++) {
            const optionId = `k${i}`;
            const choiceId = `k${optionId}${j}`;

            if (!choiceInputs[optionId]) {
              choiceInputs[optionId] = [];
            }

            choiceInputs[optionId].push(choiceId);
            setValue(`${OPTION_NAME_PREFIX}${optionId}`, option.name);
            setValue(`${OPTION_EXTRA_PREFIX}${optionId}`, option.extra);
            const choiceName = option.choices[j].name;
            const choiceExtra = option.choices[j].extra;

            setValue(`${CHOICE_NAME_PREFIX}${choiceId}`, choiceName);
            setValue(`${CHOICE_EXTRA_PREFIX}${choiceId}`, choiceExtra);
          }
        }
      }
    }

    return choiceInputs;
  };

  const [choiceInputs, setChoiceInputs] = useState<{ [key: string]: string[] }>(
    () => {
      const defaultChoiceInputs = initChoiceInputs();
      return defaultChoiceInputs;
    }
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isChangeFile, setIsChangeFile] = useState(false);

  const [editDish, { data, loading: editingDish }] = useMutation<
    EditDishMutation,
    EditDishMutationVariables
  >(EDIT_DISH_MUTATION, {
    onCompleted: (data) => {
      const { ok, error, dish } = data.editDish;
      if (ok && dish) {
        console.log("메뉴 수정 완료", dish);
        moveBack();
      } else {
        console.log("메뉴 수정 실패", error);
      }
    },
  });

  const onSubmit = async () => {
    const { name, price, description, file, ...rest } = getValues();
    console.log(rest);

    const options = Object.keys(choiceInputs).map((id) => {
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

    try {
      let photo;
      if (file && file.length > 0) {
        const formData = new FormData();
        formData.append("file", file![0]);
        photo = await updateFile(formData);
      }

      editDish({
        variables: {
          input: {
            name,
            price: +price,
            description,
            options,
            photo: photo,
            dishId: dish.id,
          },
        },
      });
    } catch (error) {
      console.log("메뉴 수정 실패", error);
    }
  };

  return (
    <div>
      <div className="container">
        <button type="button" className="button" onClick={moveBack}>
          &larr; 뒤로가기
        </button>
        <h4>Edit Dish</h4>
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
            <input
              type="file"
              accept="image/*"
              {...register("file")}
              ref={(e) => {
                register("file").ref(e); // useForm의 ref 등록
                fileInputRef.current = e; // useRef로 저장
              }}
              style={{
                visibility: !dish.photo || isChangeFile ? "visible" : "hidden",
                height: !dish.photo || isChangeFile ? "auto" : "0px",
              }}
            ></input>
            {dish.photo && !isChangeFile && (
              <div>
                <button
                  className="button bg-red-600 hover:bg-red-700"
                  type="button"
                  onClick={() => {
                    setIsChangeFile(true);
                    fileInputRef.current?.click();
                  }}
                >
                  사진변경
                </button>
                <div
                  className="bg-cover bg-center min-h-24"
                  style={{ backgroundImage: `url(${dish.photo})` }}
                ></div>
              </div>
            )}
            <div>
              <button
                type="button"
                className="button"
                onClick={() => {
                  const newOptionId = Date.now();
                  setChoiceInputs((prev) => ({
                    [`${newOptionId}`]: [],
                    ...prev,
                  }));
                }}
              >
                옵션 추가
              </button>
            </div>
            {Object.keys(choiceInputs).map((optionId) => (
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
                      const choiceId = `${Date.now()}`;
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
                      setChoiceInputs((prev) => {
                        const { optionId, ...rest } = prev;
                        return rest;
                      });
                      unregister(`${OPTION_NAME_PREFIX}${optionId}`);
                      unregister(`${OPTION_EXTRA_PREFIX}${optionId}`);
                    }}
                  >
                    삭제
                  </button>
                </div>
                <div>
                  {choiceInputs[`${optionId}`]?.map((choiceId) => {
                    return (
                      <div
                        key={choiceId}
                        className="flex grid-cols-3 mt-2 gap-3"
                      >
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
                    );
                  })}
                </div>
              </div>
            ))}
            <FormButton
              isValid={isValid}
              loading={editingDish}
              text="메뉴 수정"
            ></FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDish;
