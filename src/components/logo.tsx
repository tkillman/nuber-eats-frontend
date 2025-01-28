import { useHistory } from "react-router-dom";
import logo from "../assets/img/logo.jpg";
import { RouterPath } from "../routes/routerPath";

const Logo = () => {
  const history = useHistory();

  return (
    <img
      src={logo}
      width={"50x"}
      height={"50px"}
      alt="로고"
      onClick={() => {
        history.push(RouterPath.HOME);
      }}
    />
  );
};

export default Logo;
