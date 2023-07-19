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

        const result = await fetch(url, { signal: abortController.signal });

        if (!result.ok)
          throw Error(
            `Fetch Request Failed with Status Code of ${result.status}`
          );
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

  return { fetchedData, error, loading };
};

export default useGetFetch;
