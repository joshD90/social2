import { useLocation, useNavigate } from "react-router-dom";
import SearchServiceResults from "../../../components/searchResults/serviceSearchResults/SearchServiceResults";

const SearchResultsContainer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { searchQuery, searchResults } = state ?? {
    searchQuery: undefined,
    searchResults: undefined,
  };

  //exit if we have nothing to display
  if (
    !searchResults ||
    typeof searchResults === "string" ||
    !searchQuery ||
    !searchResults
  )
    return (
      <div className="w-full h-full flex text-stone-500 justify-center items-center relative">
        <button
          className="absolute left-2 top-2 p-2 text-stone-50 bg-green-600 rounded-sm shadow-sm hover:bg-green-500"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        No Search Results to Display
      </div>
    );

  return (
    <div className="w-full h-full overflow-auto relative">
      <button
        className="absolute left-2 top-2 p-2 text-stone-50 bg-green-600 rounded-sm shadow-sm hover:bg-green-500"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <SearchServiceResults results={searchResults} searchQuery={searchQuery} />
    </div>
  );
};

export default SearchResultsContainer;
