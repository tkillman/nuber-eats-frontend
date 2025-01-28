import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import Logo from "./logo";
import { LOCAL_STORAGE_TOKEN } from "../constant/constant";
import { RouterPath } from "../routes/routerPath";
import { isLoggedInVar } from "../apollo";

const Header = () => {
  const { data } = useMe();
  console.log("🚀 ~ Header ~ data:", data);

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-2 flex justify-center items-center">
          인증받아
        </div>
      )}
      <header className="py-2 bg-red-300">
        <div className="w-full container flex justify-between items-center">
          <Logo />
          <div className="flex gap-5">
            <Link to="/my-profile">
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <span
              className="cursor-pointer"
              onClick={() => {
                localStorage.removeItem(LOCAL_STORAGE_TOKEN);
                isLoggedInVar(false);
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
