import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import FormError from "../components/FormError";
import FormButton from "../components/FormButton";
import { Link, useHistory } from "react-router-dom";
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  UserRole,
} from "../__generated__/graphql";
import { RouterPath } from "../routes/routerPath";

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  email?: string;
  password?: string;
  role: UserRole;
}

const CreateAccount = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IForm>({
    defaultValues: {
      role: UserRole.Client,
    },
    mode: "onChange",
  });

  const history = useHistory();

  const [createUserMutation, { data, loading }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_MUTATION, {
    onCompleted: (data) => {
      const {
        createUser: { ok, error },
      } = data;
      if (ok) {
        console.log("User created");
        history.push(RouterPath.HOME);
      }
    },
  });

  const onSubmit = () => {
    if (loading) {
      return;
    }

    const { email = "", password = "", role } = getValues();
    createUserMutation({
      variables: {
        input: {
          email,
          password,
          role: role,
        },
      },
    });
  };

  return (
    <div className="bg-slate-500 h-screen flex items-center justify-center">
      <Helmet>
        <title>CreateAccount | Nuber Eats</title>
      </Helmet>
      <div className="flex flex-col bg-white w-full max-w-screen-sm px-5 py-7 rounded-md shadow-md">
        <p>Create Account</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="email"
              className="input"
              {...register("email", {
                required: "Email is required",
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            ></input>
            <FormError errorMessage={errors.email?.message} />
            {errors.email?.type === "pattern" && (
              <FormError errorMessage={"이메일 패턴이 안 맞음"} />
            )}
            <input
              type="password"
              placeholder="password"
              className="input"
              {...register("password", {
                required: "Password is required",
              })}
            ></input>
            <FormError errorMessage={errors.password?.message} />

            <select className="input" {...register("role")}>
              {Object.keys(UserRole).map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
            <FormButton
              isValid={isValid}
              loading={loading}
              text="유저생성"
            ></FormButton>
          </div>
        </form>
        <div>
          계정이 있으신가요?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
