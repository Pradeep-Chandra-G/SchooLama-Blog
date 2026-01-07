import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  // Debounce search - automatically search after 500ms of no typing
  useEffect(() => {
    if (searchValue.trim().length === 0) return;

    const timer = setTimeout(() => {
      if (location.pathname === "/posts") {
        setSearchParams({
          ...Object.fromEntries(searchParams),
          search: searchValue,
        });
      } else {
        navigate(`/posts?search=${searchValue}`);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        if (location.pathname === "/posts") {
          setSearchParams({
            ...Object.fromEntries(searchParams),
            search: query,
          });
        } else {
          navigate(`/posts?search=${query}`);
        }
      }
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (location.pathname === "/posts" && searchParams.get("search")) {
      const newParams = Object.fromEntries(searchParams);
      delete newParams.search;
      setSearchParams(newParams);
    }
  };

  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="search posts..."
        className="bg-transparent focus:outline-none w-full"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Search;
