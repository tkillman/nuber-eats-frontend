import { isLoggedInVar } from "../apollo";

export const LoggedOutRouter = () => {
  return (
    <div>
      <div>LoggedOutRouter</div>
      <button
        onClick={() => {
          isLoggedInVar(true);
        }}
      >
        log in
      </button>
    </div>
  );
};
