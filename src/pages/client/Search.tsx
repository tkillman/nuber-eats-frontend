import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SearchProps {}
const Search: FC<SearchProps> = () => {
  const location = useLocation();

  useEffect(() => {
    const search = location.search;

    console.log("🚀 ~ useEffect ~ search:", search);
  }, []);

  return <div>Search</div>;
};

export default Search;
