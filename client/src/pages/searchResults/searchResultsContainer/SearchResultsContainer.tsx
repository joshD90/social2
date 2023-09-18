import { useLocation } from "react-router-dom";
import SearchServiceResults from "../../../components/searchResults/serviceSearchResults/SearchServiceResults";

const SearchResultsContainer = () => {
  const { state } = useLocation();
  const { searchQuery, searchResults } = state;

  //exit if we have nothing to display
  if (
    !searchResults ||
    typeof searchResults === "string" ||
    !searchQuery ||
    !searchResults
  )
    return (
      <div className="w-full h-full flex text-stone-500 justify-center items-center">
        No Search Results to Display
      </div>
    );

  return (
    <div className="w-full h-full overflow-auto">
      <SearchServiceResults results={searchResults} searchQuery={searchQuery} />
    </div>
  );
};

export default SearchResultsContainer;
