import { useForm } from "react-hook-form";
import FormError from "../components/FormError";
import { gql, useMutation } from "@apollo/client";
import {
  LoginMutationMutation,
  LoginMutationMutationVariables,
} from "../__generated__/graphql";
import FormButton from "../components/FormButton";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../constant/constant";

export const LOGIN_MUTATION = gql`
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
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IForm>({
    mode: "onChange",
  });

  const history = useHistory();

  const [loginMutation, { data, loading }] = useMutation<
    LoginMutationMutation,
    LoginMutationMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const {
        login: { ok, error, token },
      } = data;
      if (ok) {
        sessionStorage.setItem(LOCAL_STORAGE_TOKEN, token || "");
        authTokenVar(token);
        isLoggedInVar(Boolean(token));
        history.replace("/");
        window.location.reload();
      }
    },
  });

  const onSubmit = () => {
    if (loading) {
      return;
    }

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
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="flex flex-col bg-white w-full max-w-screen-sm px-5 py-7 rounded-md shadow-md">
        <p>Login</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="email"
              className="input"
              {...register("email", {
                required: "이메일은 필수 입력 사항입니다.",
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            ></input>
            {errors.email?.type === "pattern" && (
              <FormError errorMessage={"이메일 패턴이 안 맞음"} />
            )}
            <FormError errorMessage={errors.email?.message} />
            <input
              type="password"
              placeholder="password"
              className="input"
              {...register("password", {
                required: "비밀번호는 필수 입력 사항입니다.",
              })}
            ></input>
            <FormError errorMessage={errors.password?.message} />
            <FormButton
              isValid={isValid}
              loading={loading}
              text="로그인"
            ></FormButton>
            <FormError errorMessage={data?.login.error} />
          </div>
        </form>
        <div>
          New to Nuber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
