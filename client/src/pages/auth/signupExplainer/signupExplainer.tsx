import { useNavigate, useLocation } from "react-router-dom";
import envIndex from "../../../envIndex/envIndex";
import { useState } from "react";

const SignupExplainer = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const navigate = useNavigate();

  const [emailResent, setEmailResent] = useState(false);
  const [resendError, setResendError] = useState<null | string>(null);

  const resendLink = async () => {
    console.log(username);
    if (!username) return;
    setResendError(null);
    setEmailResent(false);
    try {
      const url = `${envIndex.urls.baseUrl}/auth/mail-key-resend?email=${username}`;
      const result = await fetch(url);
      if (!result.ok) throw Error(result.statusText);
      setEmailResent(true);
    } catch (error) {
      setResendError((error as Error).message);
    }
  };
  return (
    <section className="text-stone-50 sm:w-4/5 md:w-2/3 mb-6">
      <div className="text-center">
        {emailResent && (
          <p className="text-green-400">Email was resent successfully</p>
        )}
        {resendError && <p className="text-red-500">{resendError}</p>}
      </div>
      <h1 className="text-center text-2xl mb-3">Welcome</h1>
      <p className="mb-3">
        You have registered with Social 2. You will soon have full access to
        your own organisations interactions with this service. Two things that
        need to happen before this
      </p>
      <p className="mb-3 ml-2">
        1. An email has been sent to your email account that you signed up with.
        Follow the link to confirm your email. The link will expire in 24 hours.
      </p>
      <p className="mb-3 ml-2">
        2. The Moderator for your particular organisation needs to approve you
        as a recognised member of that organisation.
      </p>

      <div className="w-full flex flex-col justify-center items-center gap-5">
        <button
          className="w-56 bg-green-500 hover:bg-green-600 p-2 rounded-sm"
          onClick={() => navigate("/auth/signin")}
        >
          Continue to Login
        </button>
        <button
          className="w-36 bg-stone-500 p-2 hover:bg-green-600"
          onClick={resendLink}
        >
          Resend Link
        </button>
      </div>
    </section>
  );
};

export default SignupExplainer;
