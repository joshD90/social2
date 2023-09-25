import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import envIndex from "../../envIndex/envIndex";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await fetch(`${envIndex.urls.baseUrl}/search`, {
        credentials: "include",
        body: JSON.stringify({ searchParam: searchQuery }),
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (response.status === 404) {
        navigate("/services/search", {
          state: "Nothing Matched Your Search Query",
        });
      }
      if (!response.ok) throw Error(response.statusText);
      const searchResults = await response.json();

      navigate("/services/search", {
        state: { searchQuery: searchQuery, searchResults: searchResults },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="flex items-center gap-2 text-xl" onSubmit={handleSubmit}>
      <AiOutlineSearch />
      <input
        type="text"
        className="rounded-full text-stone-800 px-2 text-lg"
        autoComplete="on"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <button type="submit" className=""></button>
    </form>
  );
};

export default SearchBar;
