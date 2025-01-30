import { ChangeEvent, MouseEvent } from "react";
import {
  CreateOrderItemInput,
  DishPartsFragment,
  InputMaybe,
  OrderItemOptionInputType,
  Scalars,
} from "../__generated__/graphql";

export type CreateOrderItemInputWithExtra = {
  dishId: Scalars["Float"]["input"];
  dishPrice: number;
  dishName: string;
  options?: InputMaybe<
    Array<OrderItemOptionInputType & { choiceExtra: number }>
  >;
};

export type OnChangeItem = (item: CreateOrderItemInputWithExtra) => void;

interface DishProps {
  dish: DishPartsFragment;
  isCheckMode?: boolean;
  onChangeItem?: OnChangeItem;
  onRemoveItem?: (dishId: number) => void;
}

export const Dish: React.FC<DishProps> = ({
  dish,
  isCheckMode = false,
  onChangeItem,
  onRemoveItem,
}) => {
  const onChangeDish = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChangeItem?.({
        dishId: dish.id,
        dishName: dish.name,
        dishPrice: dish.price,
      });
    } else {
      // 선택 취소
      dish.options?.forEach((option) => {
        onClickCancleOption(option.name)();
      });

      onRemoveItem?.(dish.id);
    }
  };

  const onChangeChoice = () => {
    const checkedChoices = document.querySelectorAll(
      "input.choice-radio:checked"
    );
    console.log("🚀 ~ onChangeChoice ~ checkedChoices", checkedChoices);

    const options = Array.from(checkedChoices).map((cb) => {
      const optionName = cb.getAttribute("name");
      const choiceName = cb.getAttribute("data-choice-name");
      const choiceExtra = cb.getAttribute("data-choice-extra");
      return {
        name: optionName!,
        choice: choiceName,
        choiceExtra: +choiceExtra!,
      };
    });

    console.log("🚀 ~ options ~ options:", options);

    onChangeItem?.({
      dishId: dish.id,
      dishName: dish.name,
      dishPrice: dish.price,
      options,
    });
  };

  const onClickChoice = (e: MouseEvent<HTMLInputElement>) => {
    // 메뉴가 선택되어 있는지 확인
    const checkedDishId = document.querySelector(`#dishId-${dish.id}:checked`);
    console.log("🚀 ~ onClickChoice ~ checkedDishId:", checkedDishId);
    if (!checkedDishId) {
      alert("메뉴를 선택해주세요.");
      e.preventDefault();
      return;
    }

    onChangeChoice();
  };

  const onClickCancleOption =
    (optionName: string) => (e?: MouseEvent<HTMLButtonElement>) => {
      const checkedChoices = document.querySelectorAll(
        `input.choice-radio[name=${optionName}]:checked`
      );
      console.log("🚀 ~ onClickCancleOption ~ checkedChoices", checkedChoices);

      if (checkedChoices.length > 0) {
        checkedChoices.forEach((cb) => {
          (cb as HTMLInputElement).checked = false;
        });
        onChangeChoice();
      }
    };

  return (
    <div>
      <div className="border border-black cursor-pointer hover:border-gray-800 transition-all">
        <div
          className="min-h-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${dish.photo})` }}
        >
          {isCheckMode && (
            <div className="flex justify-end pt-5 pr-5">
              <input
                type="checkbox"
                className="min-w-8 min-h-8"
                id={`dishId-${dish.id}`}
                onChange={onChangeDish}
              />
            </div>
          )}
        </div>
        <div className="p-5">
          <h3>메뉴명</h3>
          <h4 className="pl-5">{dish.name}</h4>
          <h3>메뉴설명</h3>
          <h5 className="pl-5">{dish.description}</h5>
          <h3 className="mt-3">가격</h3>
          <h6 className="pl-5">{dish.price}원</h6>
          <h3 className="mb-3">옵션</h3>
          {dish.options?.map((option, index) => {
            return (
              <div key={index}>
                <div className="flex justify-between items-center py-2">
                  <h6>{option.name}</h6>
                  <button
                    type="button"
                    className="button"
                    onClick={onClickCancleOption(option.name)}
                  >
                    선택취소
                  </button>
                </div>
                {option.choices?.map((choice, index) => {
                  return (
                    <div className="flex justify-between pl-5" key={index}>
                      <h6>
                        {choice.name} : {choice.extra}원
                      </h6>
                      {isCheckMode && (
                        <div className="pr-5">
                          <input
                            type="radio"
                            className="min-w-4 min-h-4 choice-radio"
                            name={option.name}
                            data-choice-name={choice.name}
                            data-choice-extra={choice.extra}
                            onClick={onClickChoice}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dish;
