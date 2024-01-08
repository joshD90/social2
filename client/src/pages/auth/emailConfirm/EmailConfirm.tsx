import { useLocation, useNavigate } from "react-router-dom";

import useGetFetch from "../../../hooks/useGetFetch";
import envIndex from "../../../envIndex/envIndex";

const EmailConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const url = `${envIndex.urls.baseUrl}/auth/compare-mail-check${location.search}`;
  const { loading, error, fetchedData } = useGetFetch<string>(url);
  console.log(fetchedData, "fetchedData");

  return (
    <section className="text-white text-xs">
      <h4 className="text-lg text-center">
        You Have been redirected from the Email Confirmation Link
      </h4>
      {loading && <p>Loading...</p>}
      {error && <p>There was an Error with validating your email {error}</p>}
      {fetchedData && (
        <div className="mt-5 flex flex-col justify-between gap-3 text-xl mb-5 items-center">
          <p>Your email has been validated.</p>
          <p>
            You will not have full access to you're organisation's input until
            approved by a moderator
          </p>
          <button
            className=" p-2 bg-green-500 hover:bg-green-600 rounded-sm w-48 mt-3"
            onClick={() => navigate("/auth/signin")}
          >
            Continue to Login
          </button>
        </div>
      )}
    </section>
  );
};

export default EmailConfirm;
