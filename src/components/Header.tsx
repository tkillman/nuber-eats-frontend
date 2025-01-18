import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="py-4 bg-red-300">
      <div className="w-full max-w-screen-xl mx-auto bg-orange-300">
        <FontAwesomeIcon icon={faCoffee} />
        im header
      </div>
    </header>
  );
};

export default Header;
