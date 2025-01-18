import { useForm } from "react-hook-form";
import FormError from "../components/FormError";
import { gql, useMutation } from "@apollo/client";
import {
  LoginMutationMutation,
  LoginMutationMutationVariables,
} from "../__generated__/graphql";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface IForm {
  email?: string;
  password?: string;
}

const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>();

  const [loginMutation, { data }] = useMutation<
    LoginMutationMutation,
    LoginMutationMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const {
        login: { ok, error, token },
      } = data;
      if (ok) {
        console.log(token);
      }
    },
  });

  const onSubmit = () => {
    const { email = "", password = "" } = getValues();

    loginMutation({
      variables: {
        loginInput: {
          email: email,
          password: password,
        },
      },
    });
  };

  return (
    <div className="bg-slate-500 h-screen flex items-center justify-center">
      <div className="flex flex-col bg-white w-full max-w-screen-sm px-5 py-7 rounded-md shadow-md">
        <p>Login</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="email"
              className="input"
              {...register("email", {
                required: "Email is required",
              })}
            ></input>
            <FormError errorMessage={errors.email?.message} />
            <input
              type="password"
              placeholder="password"
              className="input"
              {...register("password", {
                required: "Password is required",
              })}
            ></input>
            <FormError errorMessage={errors.password?.message} />
            <button className="button">로그인</button>
            <FormError errorMessage={data?.login.error} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
