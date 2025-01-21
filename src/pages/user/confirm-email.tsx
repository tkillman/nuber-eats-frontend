import { gql, useMutation } from "@apollo/client";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import { useEffect } from "react";

const VERIFY_EMAIL = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail = () => {
  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL);

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    // verifyEmail({ variables: { input: { code } } });
  }, []);

  return (
    <div>
      <h1>이메일 확인중 닫지 마세요</h1>
    </div>
  );
};

export default ConfirmEmail;
