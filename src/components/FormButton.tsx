import { FC } from "react";

interface FormButtonProps {
  isValid: boolean;
  loading: boolean;
  text: string;
}

const FormButton: FC<FormButtonProps> = (props) => {
  return (
    <button
      className={`button ${
        props.isValid
          ? "bg-blue-500 hover:bg-blue-700"
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {props.loading ? "로딩중" : props.text}
    </button>
  );
};

export default FormButton;
