const SignupExplainer = () => {
  return (
    <section className="text-stone-50 sm:w-4/5 md:w-2/3 mb-6">
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
        <button className="w-56 bg-green-500 hover:bg-green-600 p-2 rounded-sm">
          Continue to Site
        </button>
        <button className="w-36 bg-stone-500 p-2 hover:bg-green-600">
          Resend Link
        </button>
      </div>
    </section>
  );
};

export default SignupExplainer;
