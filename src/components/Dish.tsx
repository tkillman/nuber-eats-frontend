import { DishPartsFragment } from "../__generated__/graphql";

interface DishProps {
  dish: DishPartsFragment;
}

export const Dish: React.FC<DishProps> = ({ dish }) => {
  return (
    <div>
      <div className="border border-black cursor-pointer hover:border-gray-800 transition-all">
        <h4>{dish.name}</h4>
        <h5>{dish.description}</h5>
        <h6 className="mt-3">{dish.price}</h6>
      </div>
    </div>
  );
};

export default Dish;
