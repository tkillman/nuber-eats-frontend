import { FC } from "react";

interface IProps {
  errorMessage?: string | null;
}
const FormError: FC<IProps> = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <span className="text-red-600">{errorMessage}</span>;
};

export default FormError;
