import { useState, useEffect } from "react";

const useGetFetch = <T>(url: string, initialState?: T) => {
  const [fetchedData, setFetchedData] = useState<T | null>(
    initialState || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");
        const result = await fetch(url, {
          signal: abortController.signal,
          credentials: "include",
        });

        if (!result.ok)
          throw Error(
            `Fetch Request Failed with Status Code of ${result.status}`
          );
        setError("");
        const data = await result.json();

        setFetchedData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error instanceof Error) setError(error.message);
      }
    })();

    return () => abortController.abort();
  }, [url]);

  return { fetchedData, error, loading, setFetchedData };
};

export default useGetFetch;
