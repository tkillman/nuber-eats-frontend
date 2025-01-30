import { DishPartsFragment } from "../__generated__/graphql";

interface DishProps {
  dish: DishPartsFragment;
}

export const Dish: React.FC<DishProps> = ({ dish }) => {
  return (
    <div>
      <div className="border border-black cursor-pointer hover:border-gray-800 transition-all">
        <div
          className="min-h-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${dish.photo})` }}
        ></div>
        <h3>메뉴명</h3>
        <h4>{dish.name}</h4>
        <h3>메뉴설명</h3>
        <h5>{dish.description}</h5>
        <h3 className="mt-3">가격</h3>
        <h6>{dish.price}원</h6>
      </div>
    </div>
  );
};

export default Dish;
