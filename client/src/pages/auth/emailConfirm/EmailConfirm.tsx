import { useLocation } from "react-router-dom";
import findQueryParam from "../../../utils/queryParams/findQueryParam";
import useGetFetch from "../../../hooks/useGetFetch";
import envIndex from "../../../envIndex/envIndex";

const EmailConfirm = () => {
  const location = useLocation();

  const username = findQueryParam(location.search, "username");
  const magicKey = findQueryParam(location.search, "magickey");
  const url = `${envIndex.urls.baseUrl}/auth/compare-mail-check${location.search}`;
  const { loading, error, fetchedData } = useGetFetch(url);
  console.log(fetchedData, "fetchedData");

  return (
    <section className="text-white text-xs">
      <h4>You Have been redirected from the Email Confirmation Link</h4>
      {loading && <p>Loading...</p>}
      {error && <p>There was an Error with validating your email {error}</p>}
    </section>
  );
};

export default EmailConfirm;
