import { useState } from "react";

//we are putting this in a hook to keep the error and loading stateful
const useDeleteFetch = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDelete = async (url: string): Promise<string | Error> => {
    const abortController = new AbortController();
    try {
      setLoading(true);
      setError("");

      const result = await fetch(url, {
        method: "DELETE",
        signal: abortController.signal,
        credentials: "include",
      });

      if (!result.ok)
        throw new Error(
          `There was an error with the request with status code of ${result.status}:${result.statusText}`
        );

      setLoading(false);
      return "deleted";
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      }
      return error as Error;
    }
  };

  return { error, loading, fetchDelete };
};

export default useDeleteFetch;
