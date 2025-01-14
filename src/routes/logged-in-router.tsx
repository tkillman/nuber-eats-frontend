import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  return (
    <div>
      <div>LoggedInRouter</div>
      <button
        onClick={() => {
          isLoggedInVar(false);
        }}
      >
        log out
      </button>
    </div>
  );
};
