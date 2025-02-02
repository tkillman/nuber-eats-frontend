import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import Logo from "./logo";
import { LOCAL_STORAGE_TOKEN } from "../constant/constant";
import { RouterPath } from "../routes/routerPath";
import { isLoggedInVar } from "../apollo";
import { UserRole } from "../__generated__/graphql";

const Header = () => {
  const { data } = useMe();
  const history = useHistory();

  const userRoleName = () => {
    const role = data?.me.role;
    if (role === UserRole.Client) {
      return "고객";
    } else if (role === UserRole.Owner) {
      return "사장님";
    } else if (role === UserRole.Delivery) {
      return "배달원";
    }
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-2 flex justify-center items-center">
          인증받아
        </div>
      )}
      <header className="py-2 bg-red-300">
        <div className="w-full container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo /> {userRoleName()}
          </div>
          <div className="flex gap-5">
            <Link to="/my-profile">
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <span
              className="cursor-pointer"
              onClick={() => {
                sessionStorage.removeItem(LOCAL_STORAGE_TOKEN);
                isLoggedInVar(false);
                history.push(RouterPath.HOME);
              }}
            >
              로그아웃
            </span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
