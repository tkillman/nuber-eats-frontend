import { useHistory } from "react-router-dom";
import { RouterPath } from "../routes/routerPath";

const NotFound = () => {
  const history = useHistory();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>404 - Page Not Found</h1>
      <button
        className="mt-4 text-white bg-lime-600 px-4 py-2 rounded-lg"
        onClick={() => {
          history.push(RouterPath.HOME);
        }}
      >
        Go Home &rarr;
      </button>
    </div>
  );
};

export default NotFound;
