import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";

const EDIT_USER_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  email?: string;
  password?: string;
}

const MyProfile = () => {
  const { data: meData, refetch } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      email: meData?.me.email,
    },
  });

  const [editUser, { data, loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_USER_MUTATION, {
    onCompleted: async (data) => {
      console.log("editUser onCompleted");
      const {
        editProfile: { ok },
      } = data;
      if (ok) {
        alert("프로필이 수정되었습니다.");
        // const prevEmail = meData?.me.email;
        // const newEmail = getValues("email");
        // if (prevEmail !== newEmail) {
        //   console.log("캐시와 이메일이 다름");
        //   client.writeFragment({
        //     id: `User:${meData?.me.id}`,
        //     fragment: gql`
        //       fragment EditedUser on User {
        //         email
        //       }
        //     `,
        //     data: {
        //       email: newEmail,
        //     },
        //   });
        // }

        await refetch();
        history.push(RouterPath.HOME);
      }
    },
  });

  const onSubmit = () => {
    if (loading) {
      return;
    }

    const { email = "", password = "" } = getValues();

    editUser({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="bg-slate-500 h-screen flex items-center justify-center">
      <Helmet>
        <title>my-profile | Nuber Eats</title>
      </Helmet>
      <div className="flex flex-col bg-white w-full max-w-screen-sm px-5 py-7 rounded-md shadow-md">
        <p>My Profile</p>
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

            <FormButton
              isValid={isValid}
              loading={loading}
              text="프로필수정"
            ></FormButton>
            <FormError errorMessage={data?.editProfile.error} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
