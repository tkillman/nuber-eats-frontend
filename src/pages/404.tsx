import { useHistory } from "react-router-dom";
import { RouterPath } from "../routes/routerPath";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const history = useHistory();

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <h1>페이지가 없습니다.</h1>
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
