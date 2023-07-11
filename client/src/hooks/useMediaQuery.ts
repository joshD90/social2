import { useState, useEffect } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    //check to see whether our window matches the query selected
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    //change our matches when screen resizes
    const listener = () => setMatches(media.matches);

    window.addEventListener("resize", listener);

    //cleanup
    return () => window.removeEventListener("resize", listener);
  }, [query, matches]);
  //return a boolean to see whether the window size matches
  return matches;
};
