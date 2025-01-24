import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RouterPath } from "../../routes/routerPath";
import { useMe } from "../../hooks/useMe";

const VERIFY_EMAIL = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail = () => {
  const { data: meData } = useMe();

  const client = useApolloClient();
  const history = useHistory();

  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL, {
    onCompleted: (data) => {
      console.log("🚀 ~ ConfirmEmail ~ data:", data);

      const {
        verifyEmail: { ok },
      } = data;
      if (ok) {
        console.log("캐시 업데이트 해보기");
        client.writeFragment({
          id: `User:${meData?.me.id}`,
          fragment: gql`
            fragment VerifiedUser on User {
              verified
            }
          `,
          data: {
            verified: true,
          },
        });
        history.push(RouterPath.HOME);
      }
    },
  });

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ verifyingEmail", verifyingEmail);
    if (verifyingEmail) {
      return;
    }

    const [_, code] = window.location.href.split("code=");
    if (!!code) {
      verifyEmail({ variables: { input: { code } } });
    }
  }, []);

  return (
    <div>
      <h1>이메일 확인중 닫지 마세요</h1>
    </div>
  );
};

export default ConfirmEmail;
