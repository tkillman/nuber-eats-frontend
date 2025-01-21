import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import Logo from "./logo";

const Header = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-10 flex justify-center items-center">
          인증받아
        </div>
      )}
      <header className="py-4 bg-red-300">
        <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
          <Logo />
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
