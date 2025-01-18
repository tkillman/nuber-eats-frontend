import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MeQuery } from "../__generated__/graphql";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);

  if (!data || loading || error) {
    return <div>loading</div>;
  }
  console.log("data", data);
  return (
    <div>
      {Object.keys(data.me).map((r) => (
        <div>
          <span>{r} : </span>
          <span>{(data.me as any)[r]}</span>
        </div>
      ))}
    </div>
  );
};
